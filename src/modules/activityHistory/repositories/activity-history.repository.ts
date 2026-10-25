import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';
import type { ActivityHistory } from '../../../generated/prisma/client.js';
import type { RequestListActivityDto } from '../dto/query-activity-history.dto.js';
import { ActivityHistoryResponseDto } from '../dto/response-activity-history.dto.js';
import { plainToInstance } from 'class-transformer';

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

  async findAll(query: RequestListActivityDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit; // Fix 1: Rumus skip (page - 1)

    const where = buildPrismaWhere<
      RequestListActivityDto,
      Prisma.ActivityHistoryWhereInput
    >(query, {
      // kalau ada yang like, daftarkan di sini
      containsFields: ['module', 'activity'],
      // kalau ada param yang beda dengan field di db
      fieldMappings: {
        // search: 'activity',
      },
    });

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const result = await findPage(this.prisma.activityHistory, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    return {
      data: plainToInstance(ActivityHistoryResponseDto, result.data),
      pagination: result.pagination,
    };
  }
}
