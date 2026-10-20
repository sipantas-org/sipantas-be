import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { Disaster } from '../../../generated/prisma/client.js';
import { QueryDisasterDto } from '../dto/query-disaster.dto.js';
import { DisasterResponseDto } from '../dto/response-disaster.dto.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';

const withAreaNames = {
  province: { select: { name: true } },
  regency: { select: { name: true } },
} satisfies Prisma.DisasterInclude;

@Injectable()
export class DisasterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.DisasterUncheckedCreateInput): Promise<Disaster> {
    return this.prisma.disaster.create({
      data,
    });
  }

  async findAll(query: QueryDisasterDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const { search, disasterDate, ...filterQuery } = query;

    const where = buildPrismaWhere<
      typeof filterQuery,
      Prisma.DisasterWhereInput
    >(filterQuery, {
      containsFields: ['disasterCode', 'disasterName', 'disasterCategory'],
    });

    if (disasterDate) {
      const [yearStr, monthStr] = disasterDate.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
      const nextMonthStartDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

      where.disasterDate = {
        gte: startDate,
        lt: nextMonthStartDate,
      };
    }

    if (search) {
      where.OR = [
        { disasterCode: { contains: search, mode: 'insensitive' } },
        { disasterName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';
    const select = {
      disasterId: true,
      disasterCode: true,
      disasterName: true,
      disasterCategory: true,
      description: true,
      disasterStatus: true,
      disasterDate: true,
      provinceId: true,
      regencyId: true,
      ...withAreaNames,
      createdAt: true,
      updatedAt: true,
    } as const;

    const result = await findPage(this.prisma.disaster, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      select: select,
    });

    return {
      data: result.data.map((item) =>
        plainToInstance(DisasterResponseDto, item, {
          excludeExtraneousValues: true,
        }),
      ),
      // plainToInstance(DisasterResponseDto, result.data),
      pagination: result.pagination,
    };
  }

  async findById(disasterId: number) {
    const data = this.prisma.disaster.findUnique({
      where: { disasterId },
      omit: {
        provinceId: true,
        regencyId: true,
      },
      include: {
        regency: true,
        province: true,
      },
    });

    const formattedData = plainToInstance(DisasterResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return formattedData;
  }

  async update(disasterId: number, data: any): Promise<Disaster> {
    return this.prisma.disaster.update({
      where: { disasterId },
      data,
    });
  }

  async delete(disasterId: number): Promise<Disaster> {
    return this.prisma.disaster.delete({
      where: { disasterId },
    });
  }
}
