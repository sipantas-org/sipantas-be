import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { CreateProvinceDto } from '../dto/create-province.dto.js';
import { UpdateProvinceDto } from '../dto/update-province.dto.js';
import { QueryProvinceDto } from '../dto/query-province.dto.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';

@Injectable()
export class MasterAreaProvinceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProvinceDto) {
    return this.prisma.masterAreaProvince.create({ data });
  }

  async findById(id: string) {
    return this.prisma.masterAreaProvince.findUnique({
      where: { id },
      include: {
        regencies: true,
      },
    });
  }

  async findAll(query: QueryProvinceDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const { search, ...filterQuery } = query;

    const where = buildPrismaWhere<
      typeof filterQuery,
      Prisma.MasterAreaProvinceWhereInput
    >(filterQuery);

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const sortBy = query.sortBy ?? 'name';
    const sortOrder = query.sortOrder ?? 'asc';

    return findPage(this.prisma.masterAreaProvince, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async update(id: string, data: UpdateProvinceDto) {
    return this.prisma.masterAreaProvince.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.masterAreaProvince.delete({
      where: { id },
    });
  }
}
