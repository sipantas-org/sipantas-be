import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import type { UserSurveyor } from '../entities/auth.entity.js';

@Injectable()
export class UserSurveyorRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.UserSurveyorUncheckedCreateInput): Promise<UserSurveyor> {
    return this.prisma.userSurveyor.create({ data });
  }

  findPage(params: {
    status?: UserSurveyor['status'];
    skip: number;
    take: number;
  }) {
    const where = params.status ? { status: params.status } : {};
    const select = {
      surveyorId: true,
      nip: true,
      nama: true,
      phoneNumber: true,
      email: true,
      status: true,
      provinceId: true,
      regencyId: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    } as const;

    return this.prisma.$transaction([
      this.prisma.userSurveyor.findMany({
        where,
        select,
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
      }),
      this.prisma.userSurveyor.count({ where }),
    ]);
  }

  findById(idSurveyor: number): Promise<UserSurveyor | null> {
    return this.prisma.userSurveyor.findUnique({
      where: { surveyorId: idSurveyor },
    });
  }

  findByEmail(email: string): Promise<UserSurveyor | null> {
    return this.prisma.userSurveyor.findUnique({ where: { email: email } });
  }

  updateLastLogin(idSurveyor: number, lastLogin: Date): Promise<UserSurveyor> {
    return this.prisma.userSurveyor.update({
      where: { surveyorId: idSurveyor },
      data: { lastLogin: lastLogin },
    });
  }
}
