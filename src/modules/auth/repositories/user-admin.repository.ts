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
    return this.prisma.userAdmin.findUnique({ where: { Email: email } });
  }

  updateLastLogin(idAdmin: number, lastLogin: Date): Promise<UserAdmin> {
    return this.prisma.userAdmin.update({
      where: { ID_Admin: idAdmin },
      data: { Last_Login: lastLogin },
    });
  }
}
