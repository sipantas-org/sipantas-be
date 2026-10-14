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
    status?: UserSurveyor['Status'];
    skip: number;
    take: number;
  }) {
    const where = params.status ? { Status: params.status } : {};
    const select = {
      surveyorId: true,
      NIP: true,
      Nama: true,
      phoneNumber: true,
      Email: true,
      Status: true,
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
    return this.prisma.userSurveyor.findUnique({ where: { Email: email } });
  }

  updateLastLogin(idSurveyor: number, lastLogin: Date): Promise<UserSurveyor> {
    return this.prisma.userSurveyor.update({
      where: { surveyorId: idSurveyor },
      data: { lastLogin: lastLogin },
    });
  }
}
