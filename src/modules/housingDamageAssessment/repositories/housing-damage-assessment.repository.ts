import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import type { HousingDamageAssessment } from '../entities/housing-damage-assessment.entity.js';
import { QueryHousingDamageAssessmentDto } from '../dto/query-housing-damage-assessment.dto.js';
import { HousingDamageAssessmentResponseDto } from '../dto/response-housing-damage-assessment.dto.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';

@Injectable()
export class HousingDamageAssessmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: Prisma.HousingDamageAssessmentUncheckedCreateInput,
  ): Promise<HousingDamageAssessment> {
    return this.prisma.housingDamageAssessment.create({ data });
  }

  async findAll(query: QueryHousingDamageAssessmentDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const { search, housingAssessmentPartId, ...filterQuery } = query;

    const where = buildPrismaWhere<
      typeof filterQuery,
      Prisma.HousingDamageAssessmentWhereInput
    >(filterQuery, {
      containsFields: ['surveyDamageQuestion'],
    });

    if (
      housingAssessmentPartId !== undefined &&
      housingAssessmentPartId !== null &&
      (housingAssessmentPartId as any) !== ''
    ) {
      where.housingAssessmentPartId = Number(housingAssessmentPartId);
    }

    if (search) {
      where.OR = [
        { surveyDamageQuestion: { contains: search, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const result = await findPage(this.prisma.housingDamageAssessment, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        housingAssessmentPart: true,
      },
    });

    return {
      data: result.data.map((item) =>
        plainToInstance(HousingDamageAssessmentResponseDto, item, {
          excludeExtraneousValues: true,
        }),
      ),
      pagination: result.pagination,
    };
  }

  findById(id: number) {
    return this.prisma.housingDamageAssessment.findUnique({
      where: { housingDamageAssessmentId: id },
      include: {
        housingAssessmentPart: true,
      },
    });
  }

  update(
    id: number,
    data: Prisma.HousingDamageAssessmentUncheckedUpdateInput,
  ): Promise<HousingDamageAssessment> {
    return this.prisma.housingDamageAssessment.update({
      where: { housingDamageAssessmentId: id },
      data,
    });
  }

  delete(id: number): Promise<HousingDamageAssessment> {
    return this.prisma.housingDamageAssessment.delete({
      where: { housingDamageAssessmentId: id },
    });
  }
}
