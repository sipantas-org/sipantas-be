import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { CreateDistrictDto } from '../dto/create-district.dto.js';
import { UpdateDistrictDto } from '../dto/update-district.dto.js';
import { QueryDistrictDto } from '../dto/query-district.dto.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';

@Injectable()
export class MasterAreaDistrictRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDistrictDto) {
    return this.prisma.masterAreaDistrict.create({
      data,
      include: {
        regency: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.masterAreaDistrict.findUnique({
      where: { id },
      include: {
        // regency: {
        //   include: {
        //     province: true,
        //   },
        // },
        villages: true,
      },
    });
  }

  async findAll(query: QueryDistrictDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const { search, provinceId, ...filterQuery } = query;

    const where = buildPrismaWhere<
      typeof filterQuery,
      Prisma.MasterAreaDistrictWhereInput
    >(filterQuery);

    if (provinceId) {
      where.regency = { provinceId };
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const sortBy = query.sortBy ?? 'name';
    const sortOrder = query.sortOrder ?? 'asc';

    return findPage(this.prisma.masterAreaDistrict, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async update(id: string, data: UpdateDistrictDto) {
    return this.prisma.masterAreaDistrict.update({
      where: { id },
      data,
      include: {
        regency: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.masterAreaDistrict.delete({
      where: { id },
    });
  }

  async existsRegency(regencyId: string): Promise<boolean> {
    const count = await this.prisma.masterAreaRegency.count({
      where: { id: regencyId },
    });
    return count > 0;
  }
}
