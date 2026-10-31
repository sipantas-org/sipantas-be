import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import {
  ComplainAction,
  ComplainStatus,
  SurveyStatus,
} from '../../../generated/prisma/enums.js';
import { QuerySurveyComplainDto } from '../dto/query-survey-complain.dto.js';
import { ComplainResponseDto } from '../dto/response-survey-complain.dto.js';
import { SurveyComplainFileItemDto } from '../dto/create-survey-complain.dto.js';
import { findPage } from '../../../common/utils/pagination.util.js';
import { buildPrismaWhere } from '../../../common/utils/filter-data.util.js';

const defaultComplainInclude = {} satisfies Prisma.SurveyComplainInclude;

@Injectable()
export class ComplainRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    surveyId: number;
    complainantName?: string;
    complainantNik?: string;
    complainantPhone?: string;
    description: string;
    files?: SurveyComplainFileItemDto[];
  }) {
    const { files, ...complainData } = data;

    return this.prisma.$transaction(async (tx) => {
      await tx.survey.update({
        where: { surveyId: data.surveyId },
        data: { surveyStatus: SurveyStatus.OnComplain },
      });

      return tx.surveyComplain.create({
        data: {
          ...complainData,
          status: ComplainStatus.Pending,
          ...(files && files.length > 0
            ? {
                SurveyComplainDocument: {
                  create: files.map((file) => ({
                    category: file.category,
                    filePath: file.filePath,
                    fileName: file.fileName,
                  })),
                },
              }
            : {}),
        },
      });
    });
  }

  async findAll(query: QuerySurveyComplainDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const {
      search,
      nik,
      status,
      sortBy: rawSortBy,
      sortOrder: rawSortOrder,
      ...filterQuery
    } = query;

    const where = buildPrismaWhere<
      typeof filterQuery,
      Prisma.SurveyComplainWhereInput
    >(filterQuery, {
      containsFields: ['complainantName', 'complainantPhone'],
    });

    if (status) {
      where.status = status;
    }

    if (nik) {
      where.OR = [
        { complainantNik: { contains: nik, mode: 'insensitive' } },
        { Survey: { nik: { contains: nik, mode: 'insensitive' } } },
      ];
    }

    if (search) {
      where.OR = [
        { complainantName: { contains: search, mode: 'insensitive' } },
        { complainantNik: { contains: search, mode: 'insensitive' } },
        { complainantPhone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const sortBy = rawSortBy ?? 'createdAt';
    const sortOrder = rawSortOrder ?? 'desc';

    const result = await findPage(this.prisma.surveyComplain, {
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    return {
      data: result.data.map((item) =>
        plainToInstance(ComplainResponseDto, item, {
          excludeExtraneousValues: true,
        }),
      ),
      pagination: result.pagination,
    };
  }

  async findById(complainId: number) {
    const data = await this.prisma.surveyComplain.findUnique({
      where: { complainId },
      include: {
        SurveyComplainDocument: true,
      },
    });

    if (!data) return null;

    const { SurveyComplainDocument, ...rest } = data;

    return {
      ...rest,
      fileComplain: SurveyComplainDocument,
    };
  }

  /** Survei Pending terbaru untuk NIK, beserta housingDetails + fileDetails. */
  async findLatestPendingSurveyByNik(nik: string) {
    const survey = await this.prisma.survey.findFirst({
      where: { nik, surveyStatus: SurveyStatus.Pending },
      orderBy: { createdAt: 'desc' },
      select: {
        surveyId: true,
        surveyStatus: true,
        nik: true,
        assetName: true,
        addressDetail: true,
        authority: true,
        latitude: true,
        longitude: true,
        damageLevel: true,
        volume: true,
        volumeUnit: true,
        disasterId: true,
        provinceId: true,
        regencyId: true,
        districtId: true,
        villageId: true,
        createdAt: true,
        province: { select: { id: true, name: true } },
        regency: { select: { id: true, name: true } },
        district: { select: { id: true, name: true } },
        village: { select: { id: true, name: true } },
        files: {
          select: { category: true, filePath: true, fileName: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!survey) {
      return null;
    }

    const { files, ...rest } = survey;

    const housingDetails = await this.prisma.surveyHousingDetail.findMany({
      where: { surveyId: survey.surveyId },
      select: {
        housingDamageAssessmentId: true,
        totalUnit: true,
        score: true,
      },
      orderBy: { surveyHousingDetailId: 'asc' },
    });

    return { ...rest, fileDetails: files, housingDetails };
  }

  async findActiveBySurveyId(surveyId: number) {
    return this.prisma.surveyComplain.findFirst({
      where: {
        surveyId,
        status: {
          in: [ComplainStatus.Pending, ComplainStatus.OnProgress],
        },
      },
    });
  }

  async updateStatusWithTransaction(params: {
    complainId: number;
    status: ComplainStatus;
    action?: ComplainAction;
    responseNotes?: string | null;
    surveyUpdate?: {
      surveyId: number;
      surveyStatus: SurveyStatus;
    };
  }) {
    return this.prisma.$transaction(async (tx) => {
      if (params.surveyUpdate) {
        await tx.survey.update({
          where: { surveyId: params.surveyUpdate.surveyId },
          data: { surveyStatus: params.surveyUpdate.surveyStatus },
        });
      }

      return tx.surveyComplain.update({
        where: { complainId: params.complainId },
        data: {
          status: params.status,
          action: params.action,
          responseNotes: params.responseNotes,
        },
      });
    });
  }

  async delete(complainId: number) {
    return this.prisma.surveyComplain.delete({
      where: { complainId },
    });
  }
}
