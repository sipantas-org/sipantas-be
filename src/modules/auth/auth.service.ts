import * as crypto from 'crypto';
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
import { ListAdminDto } from './dto/list-admin.dto.js';
import { UpdateSurveyorProfileDto } from './dto/update-surveyor-profile.dto.js';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto.js';
import { UpdateSurveyorStatusDto } from './dto/update-surveyor-status.dto.js';
import { UpdateAdminStatusDto } from './dto/update-admin-status.dto.js';
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
      throw new UnauthorizedException('Username atau password tidak sesuai');
    }

    if (admin.status !== AdminStatus.Active) {
      await this.recordLogin(meta, LoginStatus.Failed, {
        adminId: admin.adminId,
      });
      throw new ForbiddenException('Profil sudah tidak aktif');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: admin.adminId,
      email: admin.email,
      userType: 'admin',
      role: admin.role,
    });

    await this.recordLogin(
      meta,
      LoginStatus.Success,
      {
        adminId: admin.adminId,
      },
      this.hashToken(accessToken),
    );
    await this.userAdminRepository.updateLastLogin(admin.adminId, new Date());

    return {
      accessToken,
      user: this.toResponse(UserAdminResponseDto, admin),
    };
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

  async updateAdminProfile(user: JwtPayload, dto: UpdateAdminProfileDto) {
    if (user.userType !== 'admin') {
      throw new ForbiddenException('Only admins can update admin profile');
    }

    const admin = await this.prisma.userAdmin.findUnique({
      where: { adminId: user.sub },
    });
    if (!admin) {
      throw new NotFoundException('Data Admin tidak ditemukan');
    }

    if (dto.email && dto.email !== admin.email) {
      const existing = await this.prisma.userAdmin.findUnique({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    if (dto.password) {
      const isCurrentPasswordValid = await bcrypt.compare(
        dto.currentPassword ?? '',
        admin.password,
      );
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
    }

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, SALT_ROUNDS)
      : undefined;

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.userAdmin.update({
        where: { adminId: user.sub },
        data: {
          ...(dto.nomorHp !== undefined ? { phoneNumber: dto.nomorHp } : {}),
          ...(dto.email !== undefined ? { email: dto.email } : {}),
          ...(passwordHash !== undefined ? { password: passwordHash } : {}),
        },
      });

      if (passwordHash !== undefined) {
        await this.activityHistoryService.record(
          {
            idUser: null,
            idAdmin: user.sub,
            relationId: user.sub,
            module: 'Auth - Admin Profile Update',
            activity: 'Changed own password',
          },
          tx,
        );
      }

      return result;
    });

    return this.toResponse(UserAdminResponseDto, updated);
  }

  async updateAdminStatus(
    id: number,
    dto: UpdateAdminStatusDto,
    user: JwtPayload,
  ) {
    const admin = await this.userAdminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException('Data Admin tidak ditemukan');
    }
    if (admin.role !== AdminRole.Monitoring) {
      throw new ForbiddenException(
        'Only admins with role Monitoring can have their status changed',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.userAdmin.update({
        where: { adminId: id },
        data: { status: dto.status },
      });

      await this.activityHistoryService.record(
        {
          idUser: null,
          idAdmin: user.sub,
          relationId: id,
          module: 'Auth - Admin Status Update',
          activity: `Changed admin status to ${dto.status}`,
        },
        tx,
      );

      return result;
    });

    return this.toResponse(UserAdminResponseDto, updated);
  }

  async listAdmins(query: ListAdminDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [items, total] = await this.userAdminRepository.findPage({
      role: AdminRole.Monitoring,
      status: query.status,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map((item) => this.toResponse(UserAdminResponseDto, item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
      throw new UnauthorizedException('Username atau password');
    }

    if (surveyor.status !== SurveyorStatus.Active) {
      await this.recordLogin(meta, LoginStatus.Failed, {
        userId: surveyor.surveyorId,
      });
      throw new ForbiddenException('Profil sudah tidak aktif');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: surveyor.surveyorId,
      email: surveyor.email,
      userType: 'surveyor',
    });

    await this.recordLogin(
      meta,
      LoginStatus.Success,
      {
        userId: surveyor.surveyorId,
      },
      this.hashToken(accessToken),
    );
    await this.userSurveyorRepository.updateLastLogin(
      surveyor.surveyorId,
      new Date(),
    );

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

  async updateSurveyorProfile(user: JwtPayload, dto: UpdateSurveyorProfileDto) {
    if (user.userType !== 'surveyor') {
      throw new ForbiddenException('Tipe user tidak cocok');
    }

    const surveyor = await this.userSurveyorRepository.findById(user.sub);
    if (!surveyor) {
      throw new NotFoundException('Data Surveyor tidak ditemukan');
    }

    if (dto.email && dto.email !== surveyor.email) {
      const existing = await this.prisma.userSurveyor.findUnique({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Email sudah digunakan');
      }
    }

    if (dto.password) {
      const isCurrentPasswordValid = await bcrypt.compare(
        dto.currentPassword ?? '',
        surveyor.password,
      );
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
    }

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, SALT_ROUNDS)
      : undefined;

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.userSurveyor.update({
        where: { surveyorId: user.sub },
        data: {
          ...(dto.nomorHp !== undefined ? { phoneNumber: dto.nomorHp } : {}),
          ...(dto.email !== undefined ? { email: dto.email } : {}),
          ...(passwordHash !== undefined ? { password: passwordHash } : {}),
          ...(dto.idProvince !== undefined
            ? { provinceId: String(dto.idProvince) }
            : {}),
          ...(dto.idCity !== undefined
            ? { regencyId: String(dto.idCity) }
            : {}),
        },
      });

      if (passwordHash !== undefined) {
        await this.activityHistoryService.record(
          {
            idUser: user.sub,
            idAdmin: null,
            relationId: user.sub,
            module: 'Auth - Surveyor Profile Update',
            activity: 'Changed own password',
          },
          tx,
        );
      }

      return result;
    });

    return this.toResponse(UserSurveyorResponseDto, updated);
  }

  async updateSurveyorStatus(
    id: number,
    dto: UpdateSurveyorStatusDto,
    user: JwtPayload,
  ) {
    const surveyor = await this.userSurveyorRepository.findById(id);
    if (!surveyor) {
      throw new NotFoundException('Data Surveyor tidak ditemukan');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.userSurveyor.update({
        where: { surveyorId: id },
        data: { status: dto.status },
      });

      await this.activityHistoryService.record(
        {
          idUser: null,
          idAdmin: user.sub,
          relationId: id,
          module: 'Auth - Surveyor Status Update',
          activity: `Changed surveyor status to ${dto.status}`,
        },
        tx,
      );

      return result;
    });

    return this.toResponse(UserSurveyorResponseDto, updated);
  }

  async approveSurveyor(
    idSurveyor: number,
    dto: ApproveSurveyorDto,
    admin: JwtPayload,
  ) {
    const surveyor = await this.userSurveyorRepository.findById(idSurveyor);
    if (!surveyor) {
      throw new NotFoundException('Data Surveyor tidak ditemukan');
    }
    if (surveyor.status !== SurveyorStatus.Pending) {
      throw new ConflictException(
        `Status surveyor saat ini ${surveyor.status}`,
      );
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

  async getProfile(user: JwtPayload) {
    if (user.userType === 'admin') {
      const admin = await this.prisma.userAdmin.findUnique({
        where: { adminId: user.sub },
      });
      if (!admin) {
        throw new NotFoundException('Data Admin tidak ditemukan');
      }
      return this.toResponse(UserAdminResponseDto, admin);
    }

    if (user.userType === 'surveyor') {
      const surveyor = await this.userSurveyorRepository.findById(user.sub);
      if (!surveyor) {
        throw new NotFoundException('Data Surveyor tidak ditemukan');
      }
      return this.toResponse(UserSurveyorResponseDto, surveyor);
    }

    throw new UnauthorizedException('Tipe user tidak valid');
  }

  async isTokenActiveInHistory(
    token: string,
    payload: JwtPayload,
  ): Promise<boolean> {
    const hashedToken = this.hashToken(token);
    const history = await this.prisma.loginHistory.findFirst({
      where: {
        token: hashedToken,
        statusLogin: LoginStatus.Success,
        ...(payload.userType === 'admin'
          ? { adminId: payload.sub }
          : { userId: payload.sub }),
      },
    });

    if (history) {
      return true;
    }

    // Backward compatibility fallback for logins saved with bcrypt
    const recentLogins = await this.prisma.loginHistory.findMany({
      where: {
        statusLogin: LoginStatus.Success,
        ...(payload.userType === 'admin'
          ? { adminId: payload.sub }
          : { userId: payload.sub }),
      },
      take: 5,
    });

    for (const record of recentLogins) {
      if (
        record.token.startsWith('$2') &&
        (await bcrypt.compare(token, record.token))
      ) {
        return true;
      }
    }

    return false;
  }

  private recordLogin(
    meta: LoginMeta,
    status: LoginStatus,
    actor: Pick<Prisma.LoginHistoryUncheckedCreateInput, 'adminId' | 'userId'>,
    token?: string | null,
  ) {
    return this.loginHistoryRepository.create({
      ...actor,
      ipAddress: meta.ipAddress,
      deviceInfo: meta.deviceInfo ?? null,
      statusLogin: status,
      token: token ?? '',
    });
  }

  private toResponse<T>(cls: ClassConstructor<T>, data: object): T {
    return plainToInstance(cls, data, { excludeExtraneousValues: true });
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
