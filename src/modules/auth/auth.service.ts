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
      admin !== null && (await bcrypt.compare(dto.password, admin.Password));

    if (!admin || !isPasswordValid) {
      await this.recordLogin(meta, LoginStatus.Failed, {
        ID_Admin: admin?.ID_Admin ?? null,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (admin.Status !== AdminStatus.Active) {
      await this.recordLogin(meta, LoginStatus.Failed, {
        ID_Admin: admin.ID_Admin,
      });
      throw new ForbiddenException('Account is not active');
    }

    await this.recordLogin(meta, LoginStatus.Success, {
      ID_Admin: admin.ID_Admin,
    });
    await this.userAdminRepository.updateLastLogin(admin.ID_Admin, new Date());

    const accessToken = await this.jwtService.signAsync({
      sub: admin.ID_Admin,
      email: admin.Email,
      userType: 'admin',
      role: admin.Role,
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
      (await bcrypt.compare(dto.password, surveyor.Password));

    if (!surveyor || !isPasswordValid) {
      await this.recordLogin(meta, LoginStatus.Failed, {
        ID_User: surveyor?.ID_Surveyor ?? null,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (surveyor.Status !== SurveyorStatus.Active) {
      await this.recordLogin(meta, LoginStatus.Failed, {
        ID_User: surveyor.ID_Surveyor,
      });
      throw new ForbiddenException('Account is not active');
    }

    await this.recordLogin(meta, LoginStatus.Success, {
      ID_User: surveyor.ID_Surveyor,
    });
    await this.userSurveyorRepository.updateLastLogin(
      surveyor.ID_Surveyor,
      new Date(),
    );

    const accessToken = await this.jwtService.signAsync({
      sub: surveyor.ID_Surveyor,
      email: surveyor.Email,
      userType: 'surveyor',
    });

    return {
      accessToken,
      user: this.toResponse(UserSurveyorResponseDto, surveyor),
    };
  }

  async registerSurveyor(dto: RegisterSurveyorDto) {
    const surveyor = await this.userSurveyorRepository.create({
      NIP: dto.nip,
      Nama: dto.nama,
      Nomor_HP: dto.nomorHp,
      Email: dto.email,
      Password: await bcrypt.hash(dto.password, SALT_ROUNDS),
      Status: SurveyorStatus.Pending,
      ID_Province: dto.idProvince,
      ID_City: dto.idCity,
    });

    return this.toResponse(UserSurveyorResponseDto, surveyor);
  }

  async registerAdmin(dto: RegisterAdminDto) {
    const admin = await this.userAdminRepository.create({
      NIP: dto.nip,
      Nama: dto.nama,
      Nomor_HP: dto.nomorHp,
      Email: dto.email,
      Password: await bcrypt.hash(dto.password, SALT_ROUNDS),
      Status: AdminStatus.Active,
      Role: AdminRole.Monitoring,
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
      items: items.map((item) => this.toResponse(UserSurveyorResponseDto, item)),
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
    if (surveyor.Status !== SurveyorStatus.Pending) {
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
          relationId: created.ID_Approval,
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
    actor: Pick<Prisma.LoginHistoryUncheckedCreateInput, 'ID_Admin' | 'ID_User'>,
  ) {
    return this.loginHistoryRepository.create({
      ...actor,
      IP_Address: meta.ipAddress,
      Device_Info: meta.deviceInfo ?? null,
      Status_Login: status,
    });
  }

  private toResponse<T>(cls: ClassConstructor<T>, data: object): T {
    return plainToInstance(cls, data, { excludeExtraneousValues: true });
  }
}
