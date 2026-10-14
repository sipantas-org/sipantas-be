import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { CreateSurveyFurnitureDetailDto } from '../dto/create-survey-furniture-detail.dto.js';
import { UpdateSurveyFurnitureDetailDto } from '../dto/update-survey-furniture-detail.dto.js';
import { QuerySurveyFurnitureDetailDto } from '../dto/query-survey-furniture-detail.dto.js';

@Injectable()
export class SurveyFurnitureDetailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSurveyFurnitureDetailDto) {
    return this.prisma.surveyFurnitureDetail.create({
      data: data as any,
    });
  }

  async findAll(query: QuerySurveyFurnitureDetailDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, surveyId, furnitureName, damageCategory } = query;

    const where: Prisma.SurveyFurnitureDetailWhereInput = {};

    if (search) {
      where.OR = [
        { furnitureName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (surveyId) {
      where.surveyId = surveyId;
    }

    if (furnitureName) {
      where.furnitureName = { contains: furnitureName, mode: 'insensitive' };
    }

    if (damageCategory) {
      where.damageCategory = damageCategory;
    }

    const [data, total] = await Promise.all([
      this.prisma.surveyFurnitureDetail.findMany({
        where,
        skip,
        take: limit,
        orderBy: { surveyFurnitureDetailId: 'desc' },
      }),
      this.prisma.surveyFurnitureDetail.count({ where }),
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
    return this.prisma.surveyFurnitureDetail.findUnique({
      where: { surveyFurnitureDetailId: id },
    });
  }

  async update(id: number, data: UpdateSurveyFurnitureDetailDto) {
    return this.prisma.surveyFurnitureDetail.update({
      where: { surveyFurnitureDetailId: id },
      data: data as any,
    });
  }

  async delete(id: number) {
    return this.prisma.surveyFurnitureDetail.delete({
      where: { surveyFurnitureDetailId: id },
    });
  }
}
