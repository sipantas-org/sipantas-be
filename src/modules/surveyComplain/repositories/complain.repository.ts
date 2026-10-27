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

const defaultComplainInclude = {
  Survey: {
    select: {
      surveyId: true,
      nik: true,
      assetName: true,
      surveyStatus: true,
    },
  },
  SurveyComplainDocument: true,
} satisfies Prisma.SurveyComplainInclude;

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

    return this.prisma.surveyComplain.create({
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
      include: defaultComplainInclude,
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
      include: defaultComplainInclude,
    });

    return {
      data: result.data.map((item) =>
        plainToInstance(ComplainResponseDto, item),
      ),
      pagination: result.pagination,
      meta: result.pagination,
    };
  }

  async findById(complainId: number) {
    return this.prisma.surveyComplain.findUnique({
      where: { complainId },
      include: defaultComplainInclude,
    });
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
        include: defaultComplainInclude,
      });
    });
  }

  async delete(complainId: number) {
    return this.prisma.surveyComplain.delete({
      where: { complainId },
    });
  }
}
