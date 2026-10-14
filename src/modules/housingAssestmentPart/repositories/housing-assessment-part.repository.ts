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
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, partStatus, partName } = query;

    const where: Prisma.HousingAssessmentPartWhereInput = {};

    if (search) {
      where.OR = [{ partName: { contains: search, mode: 'insensitive' } }];
    }

    if (partName) {
      where.partName = { contains: partName, mode: 'insensitive' };
    }

    if (partStatus) {
      where.partStatus = partStatus;
    }

    const [data, total] = await Promise.all([
      this.prisma.housingAssessmentPart.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.housingAssessmentPart.count({ where }),
    ]);

    const formattedData = plainToInstance(
      HousingAssessmentPartResponseDto,
      data,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: formattedData,
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
