import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import type { LoginHistory } from '../entities/auth.entity.js';

@Injectable()
export class LoginHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.LoginHistoryUncheckedCreateInput): Promise<LoginHistory> {
    return this.prisma.loginHistory.create({ data });
  }
}
