import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { plainToInstance } from 'class-transformer';
import { SurveyResponseDto } from '../dto/response-survey.dto.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';
import type { QuerySurveyDto } from '../dto/query-survey.dto.js';
import type {
  CreateSurveyFurnitureDetailDto,
  CreateSurveyHousingDetailDto,
  CreateSurveyLostDetailDto,
} from '../dto/create-survey.dto.js';

export interface CreateSurveyFileDetailItem {
  category: string;
  filePath: string;
  fileName: string;
}

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
    fileDetails?: CreateSurveyFileDetailItem[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      const survey = await tx.survey.create({
        data: params.data,
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

      if (params.fileDetails && params.fileDetails.length > 0) {
        await tx.surveyFileDetail.createMany({
          data: params.fileDetails.map((item) => ({
            ...item,
            surveyId: survey.surveyId,
          })),
        });
      }

      return this.findById(survey.surveyId, tx);
    });
  }

  async createFileDetails(
    surveyId: number,
    fileDetails: CreateSurveyFileDetailItem[],
    tx?: Prisma.TransactionClient,
  ) {
    if (!fileDetails.length) return;
    const client = tx ?? this.prisma;
    return client.surveyFileDetail.createMany({
      data: fileDetails.map((item) => ({ ...item, surveyId })),
    });
  }

  async syncFileDetails(
    surveyId: number,
    fileDetails: CreateSurveyFileDetailItem[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    await client.surveyFileDetail.deleteMany({ where: { surveyId } });
    if (fileDetails.length > 0) {
      await this.createFileDetails(surveyId, fileDetails, tx);
    }
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

    const { startDate, endDate, ...filterQuery } = query;

    const where = buildPrismaWhere<typeof filterQuery, Prisma.SurveyWhereInput>(
      filterQuery as QuerySurveyDto,
      {
        containsFields: ['assetName', 'nik'],
        fieldMappings: {},
      },
    );

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate
          ? { gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)) }
          : {}),
        ...(endDate
          ? { lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) }
          : {}),
      };
    }

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const result = await findPage(this.prisma.survey, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        province: true,
        regency: true,
        district: true,
        disaster: true,
        village: true,
        surveyor: {
          select: {
            nama: true,
            nip: true,
            phoneNumber: true,
          },
        },
      },
    });

    return {
      data: result.data.map((item) =>
        plainToInstance(
          SurveyResponseDto,
          {
            ...item,
            totalScore: item.totalScore?.toString() ?? null,
            totalPriceUnit: item.totalPriceUnit?.toString() ?? null,
            totalPriceFurniture: item.totalPriceFurniture?.toString() ?? null,
          },
          {
            excludeExtraneousValues: true,
          },
        ),
      ),
      pagination: result.pagination,
    };
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
        surveyor: {
          select: {
            nama: true,
            nip: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!survey) {
      return null;
    }

    const [furnitureDetails, housingDetails, lostDetails, fileDetails] =
      await Promise.all([
        client.surveyFurnitureDetail.findMany({ where: { surveyId } }),
        client.surveyHousingDetail.findMany({ where: { surveyId } }),
        client.surveyLostDetail.findMany({
          where: { surveyId },
          include: {
            LossAssessment: {
              select: {
                typeOfLoss: true,
              },
            },
          },
        }),
        client.surveyFileDetail.findMany({ where: { surveyId } }),
      ]);

    return {
      ...survey,
      furnitureDetails,
      housingDetails,
      lostDetails: lostDetails.map(({ LossAssessment, ...detail }) => ({
        ...detail,
        typeOfLoss: LossAssessment?.typeOfLoss ?? null,
      })),
      fileDetails,
    };
  }

  async updateWithDetails(
    surveyId: number,
    params: {
      data: Prisma.SurveyUpdateInput;
      furnitureDetails?: CreateSurveyFurnitureDetailDto[];
      housingDetails?: CreateSurveyHousingDetailDto[];
      lostDetails?: CreateSurveyLostDetailDto[];
      fileDetails?: CreateSurveyFileDetailItem[];
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

      if (params.fileDetails !== undefined) {
        await this.syncFileDetails(surveyId, params.fileDetails, tx);
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
        tx.surveyFileDetail.deleteMany({ where: { surveyId } }),
      ]);

      return tx.survey.delete({
        where: { surveyId },
      });
    });
  }
}
