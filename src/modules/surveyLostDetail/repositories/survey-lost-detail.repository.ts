import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { CreateSurveyLostDetailDto } from '../dto/create-survey-lost-detail.dto.js';
import { UpdateSurveyLostDetailDto } from '../dto/update-survey-lost-detail.dto.js';
import { QuerySurveyLostDetailDto } from '../dto/query-survey-lost-detail.dto.js';

@Injectable()
export class SurveyLostDetailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSurveyLostDetailDto) {
    return this.prisma.surveyLostDetail.create({
      data: data as any,
    });
  }

  async findAll(query: QuerySurveyLostDetailDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, surveyId, lostAssessmentId, durationUnit } = query;

    const where: Prisma.SurveyLostDetailWhereInput = {};

    if (search) {
      where.description = { contains: search, mode: 'insensitive' };
    }

    if (surveyId) {
      where.surveyId = surveyId;
    }

    if (lostAssessmentId) {
      where.lostAssessmentId = lostAssessmentId;
    }

    if (durationUnit) {
      where.durationUnit = durationUnit;
    }

    const [data, total] = await Promise.all([
      this.prisma.surveyLostDetail.findMany({
        where,
        skip,
        take: limit,
        orderBy: { surveyLostDetailId: 'desc' },
      }),
      this.prisma.surveyLostDetail.count({ where }),
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
    return this.prisma.surveyLostDetail.findUnique({
      where: { surveyLostDetailId: id },
    });
  }

  async update(id: number, data: UpdateSurveyLostDetailDto) {
    return this.prisma.surveyLostDetail.update({
      where: { surveyLostDetailId: id },
      data: data as any,
    });
  }

  async delete(id: number) {
    return this.prisma.surveyLostDetail.delete({
      where: { surveyLostDetailId: id },
    });
  }
}
