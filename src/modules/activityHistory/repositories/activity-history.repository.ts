import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { AdminRole } from '../../../generated/prisma/enums.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';
import type { ActivityHistory } from '../../../generated/prisma/client.js';
import type { RequestListActivityDto } from '../dto/query-activity-history.dto.js';
import { ActivityHistoryResponseDto } from '../dto/response-activity-history.dto.js';
import { plainToInstance } from 'class-transformer';

const withUserAndAdminName = {
  user: { select: { nama: true } },
  admin: { select: { nama: true, role: true } },
} satisfies Prisma.ActivityHistoryInclude;

type ActivityHistoryWithUserAndAdminName = Prisma.ActivityHistoryGetPayload<{
  include: typeof withUserAndAdminName;
}>;

// Field yang tidak bisa di-ORDER BY lewat SQL.
const VIRTUAL_SORT_FIELDS = ['name', 'userType'] as const;
type VirtualSortField = (typeof VIRTUAL_SORT_FIELDS)[number];

function isVirtualSortField(value: string): value is VirtualSortField {
  return (VIRTUAL_SORT_FIELDS as readonly string[]).includes(value);
}

function withResolvedNameAndType({
  user,
  admin,
  ...item
}: ActivityHistoryWithUserAndAdminName) {
  return {
    ...item,
    name: user?.nama ?? admin?.nama ?? null,
    userType: user ? 'Surveyor' : admin ? (admin.role as AdminRole) : null,
  };
}

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

    const { name, userType, ...filterQuery } = query;

    const where = buildPrismaWhere<
      typeof filterQuery,
      Prisma.ActivityHistoryWhereInput
    >(filterQuery, {
      // kalau ada yang like, daftarkan di sini
      containsFields: ['module', 'activity'],
      // kalau ada param yang beda dengan field di db
      fieldMappings: {
        // search: 'activity',
      },
    });

    if (name) {
      where.OR = [
        { user: { nama: { contains: name, mode: 'insensitive' } } },
        { admin: { nama: { contains: name, mode: 'insensitive' } } },
      ];
    }

    if (userType === 'Surveyor') {
      where.userId ??= { not: null };
    } else if (userType) {
      where.admin = { role: userType };
    }

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    if (isVirtualSortField(sortBy)) {
      return this.findAllSortedByVirtualField(where, sortBy, sortOrder, {
        page,
        limit,
        skip,
      });
    }

    const result = await findPage(this.prisma.activityHistory, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: withUserAndAdminName,
    });

    const data = result.data as ActivityHistoryWithUserAndAdminName[];

    return {
      data: plainToInstance(
        ActivityHistoryResponseDto,
        data.map(withResolvedNameAndType),
      ),
      pagination: result.pagination,
    };
  }

  /** Urutkan hasil berdasarkan name/userType, yang tidak bisa di-ORDER BY di SQL. */
  private async findAllSortedByVirtualField(
    where: Prisma.ActivityHistoryWhereInput,
    sortBy: 'name' | 'userType',
    sortOrder: 'asc' | 'desc',
    { page, limit, skip }: { page: number; limit: number; skip: number },
  ) {
    const rows = (await this.prisma.activityHistory.findMany({
      where,
      include: withUserAndAdminName,
    })) as ActivityHistoryWithUserAndAdminName[];

    const mapped = rows.map(withResolvedNameAndType);

    mapped.sort((a, b) => {
      const cmp = (a[sortBy] ?? '').localeCompare(b[sortBy] ?? '');
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    const total = mapped.length;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

    return {
      data: plainToInstance(
        ActivityHistoryResponseDto,
        mapped.slice(skip, skip + limit),
      ),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
