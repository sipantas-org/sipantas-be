import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { CreateVillageDto } from '../dto/create-village.dto.js';
import { UpdateVillageDto } from '../dto/update-village.dto.js';
import { QueryVillageDto } from '../dto/query-village.dto.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';

@Injectable()
export class MasterAreaVillageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVillageDto) {
    return this.prisma.masterAreaVillage.create({
      data,
      include: {
        district: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.masterAreaVillage.findUnique({
      where: { id },
      // include: {
      //   district: {
      //     include: {
      //       regency: {
      //         include: {
      //           province: true,
      //         },
      //       },
      //     },
      //   },
      // },
    });
  }

  async findAll(query: QueryVillageDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const { search, regencyId, provinceId, ...filterQuery } = query;

    const where = buildPrismaWhere<
      typeof filterQuery,
      Prisma.MasterAreaVillageWhereInput
    >(filterQuery);

    if (regencyId || provinceId) {
      where.district = {
        ...(regencyId ? { regencyId } : {}),
        ...(provinceId ? { regency: { provinceId } } : {}),
      };
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const sortBy = query.sortBy ?? 'name';
    const sortOrder = query.sortOrder ?? 'asc';

    return findPage(this.prisma.masterAreaVillage, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async update(id: string, data: UpdateVillageDto) {
    return this.prisma.masterAreaVillage.update({
      where: { id },
      data,
      include: {
        district: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.masterAreaVillage.delete({
      where: { id },
    });
  }

  async existsDistrict(districtId: string): Promise<boolean> {
    const count = await this.prisma.masterAreaDistrict.count({
      where: { id: districtId },
    });
    return count > 0;
  }
}
