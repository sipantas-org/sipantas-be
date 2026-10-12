import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import type { ActivityHistory } from '../entities/activity-history.entity.js';

@Injectable()
export class ActivityHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: Prisma.ActivityHistoryUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ActivityHistory> {
    const client = tx ?? this.prisma;
    return client.activityHistory.create({ data });
  }
}
