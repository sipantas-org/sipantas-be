import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import type { UserAdmin } from '../entities/auth.entity.js';

@Injectable()
export class UserAdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.UserAdminUncheckedCreateInput): Promise<UserAdmin> {
    return this.prisma.userAdmin.create({ data });
  }

  findByEmail(email: string): Promise<UserAdmin | null> {
    return this.prisma.userAdmin.findUnique({ where: { email: email } });
  }

  findById(idAdmin: number): Promise<UserAdmin | null> {
    return this.prisma.userAdmin.findUnique({
      where: { adminId: idAdmin },
    });
  }

  findPage(params: {
    role?: UserAdmin['role'];
    status?: UserAdmin['status'];
    skip: number;
    take: number;
  }) {
    const where = {
      ...(params.role ? { role: params.role } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    return this.prisma.$transaction([
      this.prisma.userAdmin.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
      }),
      this.prisma.userAdmin.count({ where }),
    ]);
  }

  updateLastLogin(idAdmin: number, lastLogin: Date): Promise<UserAdmin> {
    return this.prisma.userAdmin.update({
      where: { adminId: idAdmin },
      data: { lastLogin: lastLogin },
    });
  }
}
