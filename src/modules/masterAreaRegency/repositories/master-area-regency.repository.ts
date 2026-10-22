import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { CreateRegencyDto } from '../dto/create-regency.dto.js';
import { UpdateRegencyDto } from '../dto/update-regency.dto.js';
import { QueryRegencyDto } from '../dto/query-regency.dto.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';

@Injectable()
export class MasterAreaRegencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRegencyDto) {
    return this.prisma.masterAreaRegency.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.masterAreaRegency.findUnique({
      where: { id },
      include: {
        districts: true,
      },
    });
  }

  async findAll(query: QueryRegencyDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const { search, ...filterQuery } = query;

    const where = buildPrismaWhere<
      typeof filterQuery,
      Prisma.MasterAreaRegencyWhereInput
    >(filterQuery);

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const sortBy = query.sortBy ?? 'name';
    const sortOrder = query.sortOrder ?? 'asc';

    return findPage(this.prisma.masterAreaRegency, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async update(id: string, data: UpdateRegencyDto) {
    return this.prisma.masterAreaRegency.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.masterAreaRegency.delete({
      where: { id },
    });
  }

  async existsProvince(provinceId: string): Promise<boolean> {
    const count = await this.prisma.masterAreaProvince.count({
      where: { id: provinceId },
    });
    return count > 0;
  }
}
