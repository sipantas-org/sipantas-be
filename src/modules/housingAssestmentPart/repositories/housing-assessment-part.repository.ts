import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import {
  HousingAssessmentPart as HousingAssessmentPart,
  Prisma,
} from '../../../generated/prisma/client.js';
import { CreateHousingAssessmentPartDto } from '../dto/create-housing-assessment-part.dto.js';
import { UpdateHousingAssessmentPartDto } from '../dto/update-housing-assessment-part.dto.js';
import { QueryHousingAssessmentPartDto } from '../dto/query-housing-assessment-part.dto.js';
import { HousingAssessmentPartResponseDto } from '../dto/response-housing-assessment-part.dto.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';

@Injectable()
export class HousingAssessmentPartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateHousingAssessmentPartDto,
  ): Promise<HousingAssessmentPart> {
    return this.prisma.housingAssessmentPart.create({
      data,
    });
  }

  async findAll(query: QueryHousingAssessmentPartDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const { search, ...filterQuery } = query;

    const where = buildPrismaWhere<
      typeof filterQuery,
      Prisma.HousingAssessmentPartWhereInput
    >(filterQuery, {
      containsFields: ['partName'],
    });

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const result = await findPage(this.prisma.housingAssessmentPart, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    return {
      data: plainToInstance(HousingAssessmentPartResponseDto, result.data),
      pagination: result.pagination,
    };
  }

  async findById(housingAssessmentPartId: number) {
    const data = await this.prisma.housingAssessmentPart.findUnique({
      where: { housingAssessmentPartId },
    });

    return plainToInstance(HousingAssessmentPartResponseDto, data);
  }

  async update(
    housingAssessmentPartId: number,
    data: UpdateHousingAssessmentPartDto,
  ): Promise<HousingAssessmentPart> {
    return this.prisma.housingAssessmentPart.update({
      where: { housingAssessmentPartId },
      data,
    });
  }

  async delete(
    housingAssessmentPartId: number,
  ): Promise<HousingAssessmentPart> {
    return this.prisma.housingAssessmentPart.delete({
      where: { housingAssessmentPartId },
    });
  }
}
