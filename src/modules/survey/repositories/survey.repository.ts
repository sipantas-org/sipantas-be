import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';
import type { QuerySurveyDto } from '../dto/query-survey.dto.js';
import type {
  CreateSurveyFurnitureDetailDto,
  CreateSurveyHousingDetailDto,
  CreateSurveyLostDetailDto,
} from '../dto/create-survey.dto.js';

@Injectable()
export class SurveyRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.SurveyCreateInput) {
    return this.prisma.survey.create({
      data,
      include: {
        province: true,
        regency: true,
        district: true,
        village: true,
      },
    });
  }

  async createWithDetails(params: {
    data: Prisma.SurveyCreateInput;
    furnitureDetails?: CreateSurveyFurnitureDetailDto[];
    housingDetails?: CreateSurveyHousingDetailDto[];
    lostDetails?: CreateSurveyLostDetailDto[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      const survey = await tx.survey.create({
        data: params.data,
        include: {
          province: true,
          regency: true,
          district: true,
          village: true,
        },
      });

      if (params.furnitureDetails && params.furnitureDetails.length > 0) {
        await tx.surveyFurnitureDetail.createMany({
          data: params.furnitureDetails.map((item) => ({
            ...item,
            surveyId: survey.surveyId,
          })),
        });
      }

      if (params.housingDetails && params.housingDetails.length > 0) {
        await tx.surveyHousingDetail.createMany({
          data: params.housingDetails.map((item) => ({
            ...item,
            surveyId: survey.surveyId,
          })),
        });
      }

      if (params.lostDetails && params.lostDetails.length > 0) {
        await tx.surveyLostDetail.createMany({
          data: params.lostDetails.map((item) => ({
            ...item,
            surveyId: survey.surveyId,
          })),
        });
      }

      return this.findById(survey.surveyId, tx);
    });
  }

  findHousingAssessmentParts(housingDamageAssessmentIds: number[]) {
    return this.prisma.housingDamageAssessment.findMany({
      where: {
        housingDamageAssessmentId: { in: housingDamageAssessmentIds },
      },
      select: {
        housingDamageAssessmentId: true,
        housingAssessmentPartId: true,
      },
    });
  }

  async findAll(query: QuerySurveyDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const where = buildPrismaWhere<QuerySurveyDto, Prisma.SurveyWhereInput>(
      query,
      {
        containsFields: ['status'],
        fieldMappings: {},
      },
    );

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    return findPage(this.prisma.survey, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        province: true,
        regency: true,
        district: true,
        village: true,
      },
    });
  }

  async findById(surveyId: number, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    const survey = await client.survey.findUnique({
      where: { surveyId },
      include: {
        province: true,
        regency: true,
        district: true,
        village: true,
      },
    });

    if (!survey) {
      return null;
    }

    const [furnitureDetails, housingDetails, lostDetails] = await Promise.all([
      client.surveyFurnitureDetail.findMany({ where: { surveyId } }),
      client.surveyHousingDetail.findMany({ where: { surveyId } }),
      client.surveyLostDetail.findMany({ where: { surveyId } }),
    ]);

    return {
      ...survey,
      furnitureDetails,
      housingDetails,
      lostDetails,
    };
  }

  async updateWithDetails(
    surveyId: number,
    params: {
      data: Prisma.SurveyUpdateInput;
      furnitureDetails?: CreateSurveyFurnitureDetailDto[];
      housingDetails?: CreateSurveyHousingDetailDto[];
      lostDetails?: CreateSurveyLostDetailDto[];
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.survey.update({
        where: { surveyId },
        data: params.data,
      });

      if (params.furnitureDetails !== undefined) {
        await tx.surveyFurnitureDetail.deleteMany({ where: { surveyId } });
        if (params.furnitureDetails.length > 0) {
          await tx.surveyFurnitureDetail.createMany({
            data: params.furnitureDetails.map((item) => ({
              ...item,
              surveyId,
            })),
          });
        }
      }

      if (params.housingDetails !== undefined) {
        await tx.surveyHousingDetail.deleteMany({ where: { surveyId } });
        if (params.housingDetails.length > 0) {
          await tx.surveyHousingDetail.createMany({
            data: params.housingDetails.map((item) => ({
              ...item,
              surveyId,
            })),
          });
        }
      }

      if (params.lostDetails !== undefined) {
        await tx.surveyLostDetail.deleteMany({ where: { surveyId } });
        if (params.lostDetails.length > 0) {
          await tx.surveyLostDetail.createMany({
            data: params.lostDetails.map((item) => ({
              ...item,
              surveyId,
            })),
          });
        }
      }

      return this.findById(surveyId, tx);
    });
  }

  update(surveyId: number, data: Prisma.SurveyUpdateInput) {
    return this.prisma.survey.update({
      where: { surveyId },
      data,
    });
  }

  delete(surveyId: number) {
    return this.prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.surveyFurnitureDetail.deleteMany({ where: { surveyId } }),
        tx.surveyHousingDetail.deleteMany({ where: { surveyId } }),
        tx.surveyLostDetail.deleteMany({ where: { surveyId } }),
      ]);

      return tx.survey.delete({
        where: { surveyId },
      });
    });
  }
}
