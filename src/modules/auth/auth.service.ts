import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { ActivityHistoryService } from '../activityHistory/activity-history.service.js';
import {
  AdminRole,
  AdminStatus,
  LoginStatus,
  SurveyorStatus,
} from '../../generated/prisma/enums.js';
import { UserAdminRepository } from './repositories/user-admin.repository.js';
import { UserSurveyorRepository } from './repositories/user-surveyor.repository.js';
import { LoginHistoryRepository } from './repositories/login-history.repository.js';
import { ApprovalUserRepository } from './repositories/approval-user.repository.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterSurveyorDto } from './dto/register-surveyor.dto.js';
import { ApproveSurveyorDto } from './dto/approve-surveyor.dto.js';
import { RegisterAdminDto } from './dto/register-admin.dto.js';
import { ListSurveyorDto } from './dto/list-surveyor.dto.js';
import {
  ApprovalUserResponseDto,
  UserAdminResponseDto,
  UserSurveyorResponseDto,
} from './dto/response-auth.dto.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';

interface LoginMeta {
  ipAddress: string;
  deviceInfo?: string;
}

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly userAdminRepository: UserAdminRepository,
    private readonly userSurveyorRepository: UserSurveyorRepository,
    private readonly loginHistoryRepository: LoginHistoryRepository,
    private readonly approvalUserRepository: ApprovalUserRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  async loginAdmin(dto: LoginDto, meta: LoginMeta) {
    const admin = await this.userAdminRepository.findByEmail(dto.email);
    const isPasswordValid =
      admin !== null && (await bcrypt.compare(dto.password, admin.password));

    if (!admin || !isPasswordValid) {
      await this.recordLogin(meta, LoginStatus.Failed, {
        adminId: admin?.adminId ?? null,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (admin.status !== AdminStatus.Active) {
      await this.recordLogin(meta, LoginStatus.Failed, {
        adminId: admin.adminId,
      });
      throw new ForbiddenException('Account is not active');
    }

    await this.recordLogin(meta, LoginStatus.Success, {
      adminId: admin.adminId,
    });
    await this.userAdminRepository.updateLastLogin(admin.adminId, new Date());

    const accessToken = await this.jwtService.signAsync({
      sub: admin.adminId,
      email: admin.email,
      userType: 'admin',
      role: admin.role,
    });

    return {
      accessToken,
      user: this.toResponse(UserAdminResponseDto, admin),
    };
  }

  async loginSurveyor(dto: LoginDto, meta: LoginMeta) {
    const surveyor = await this.userSurveyorRepository.findByEmail(dto.email);
    const isPasswordValid =
      surveyor !== null &&
      (await bcrypt.compare(dto.password, surveyor.password));

    if (!surveyor || !isPasswordValid) {
      await this.recordLogin(meta, LoginStatus.Failed, {
        userId: surveyor?.surveyorId ?? null,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (surveyor.status !== SurveyorStatus.Active) {
      await this.recordLogin(meta, LoginStatus.Failed, {
        userId: surveyor.surveyorId,
      });
      throw new ForbiddenException('Account is not active');
    }

    await this.recordLogin(meta, LoginStatus.Success, {
      userId: surveyor.surveyorId,
    });
    await this.userSurveyorRepository.updateLastLogin(
      surveyor.surveyorId,
      new Date(),
    );

    const accessToken = await this.jwtService.signAsync({
      sub: surveyor.surveyorId,
      email: surveyor.email,
      userType: 'surveyor',
    });

    return {
      accessToken,
      user: this.toResponse(UserSurveyorResponseDto, surveyor),
    };
  }

  async registerSurveyor(dto: RegisterSurveyorDto) {
    const surveyor = await this.userSurveyorRepository.create({
      nip: dto.nip,
      nama: dto.nama,
      phoneNumber: dto.nomorHp,
      email: dto.email,
      password: await bcrypt.hash(dto.password, SALT_ROUNDS),
      status: SurveyorStatus.Pending,
      provinceId: dto.idProvince,
      regencyId: dto.idCity,
    });

    return this.toResponse(UserSurveyorResponseDto, surveyor);
  }

  async registerAdmin(dto: RegisterAdminDto) {
    const admin = await this.userAdminRepository.create({
      nip: dto.nip,
      nama: dto.nama,
      phoneNumber: dto.nomorHp,
      email: dto.email,
      password: await bcrypt.hash(dto.password, SALT_ROUNDS),
      status: AdminStatus.Active,
      role: AdminRole.Monitoring,
    });

    return this.toResponse(UserAdminResponseDto, admin);
  }

  async listSurveyors(query: ListSurveyorDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [items, total] = await this.userSurveyorRepository.findPage({
      status: query.status,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map((item) =>
        this.toResponse(UserSurveyorResponseDto, item),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async approveSurveyor(
    idSurveyor: number,
    dto: ApproveSurveyorDto,
    admin: JwtPayload,
  ) {
    const surveyor = await this.userSurveyorRepository.findById(idSurveyor);
    if (!surveyor) {
      throw new NotFoundException('Surveyor not found');
    }
    if (surveyor.status !== SurveyorStatus.Pending) {
      throw new ConflictException('Surveyor is not pending approval');
    }

    const approval = await this.prisma.$transaction(async (tx) => {
      const created = await this.approvalUserRepository.decide(
        {
          idSurveyor,
          idAdmin: admin.sub,
          status: dto.status,
          description: dto.description,
        },
        tx,
      );

      await this.activityHistoryService.record(
        {
          idUser: null,
          idAdmin: admin.sub,
          relationId: created.approvalId,
          module: 'Auth - Surveyor Approval Admin',
          activity:
            dto.status === 'Approved'
              ? 'Approved surveyor registration'
              : 'Rejected surveyor registration',
        },
        tx,
      );

      return created;
    });

    return this.toResponse(ApprovalUserResponseDto, approval);
  }

  private recordLogin(
    meta: LoginMeta,
    status: LoginStatus,
    actor: Pick<Prisma.LoginHistoryUncheckedCreateInput, 'adminId' | 'userId'>,
  ) {
    return this.loginHistoryRepository.create({
      ...actor,
      ipAddress: meta.ipAddress,
      deviceInfo: meta.deviceInfo ?? null,
      statusLogin: status,
    });
  }

  private toResponse<T>(cls: ClassConstructor<T>, data: object): T {
    return plainToInstance(cls, data, { excludeExtraneousValues: true });
  }
}
