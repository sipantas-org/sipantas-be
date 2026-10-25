import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { CreateSurveyHousingDetailDto } from '../dto/create-survey-housing-detail.dto.js';
import { UpdateSurveyHousingDetailDto } from '../dto/update-survey-housing-detail.dto.js';
import { QuerySurveyHousingDetailDto } from '../dto/query-survey-housing-detail.dto.js';

@Injectable()
export class SurveyHousingDetailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSurveyHousingDetailDto) {
    return this.prisma.surveyHousingDetail.create({
      data: data as any,
    });
  }

  async findAll(query: QuerySurveyHousingDetailDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { surveyId, housingDamageAssessmentId } = query;

    const where: Prisma.SurveyHousingDetailWhereInput = {};

    if (surveyId) {
      where.surveyId = surveyId;
    }

    if (housingDamageAssessmentId) {
      where.housingDamageAssessmentId = housingDamageAssessmentId;
    }

    const [data, total] = await Promise.all([
      this.prisma.surveyHousingDetail.findMany({
        where,
        skip,
        take: limit,
        orderBy: { surveyHousingDetailId: 'desc' },
      }),
      this.prisma.surveyHousingDetail.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
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

  async findById(id: number) {
    return this.prisma.surveyHousingDetail.findUnique({
      where: { surveyHousingDetailId: id },
    });
  }

  async update(id: number, data: UpdateSurveyHousingDetailDto) {
    return this.prisma.surveyHousingDetail.update({
      where: { surveyHousingDetailId: id },
      data: data as any,
    });
  }

  async delete(id: number) {
    return this.prisma.surveyHousingDetail.delete({
      where: { surveyHousingDetailId: id },
    });
  }
}
