// src/housing-assessment-part/housing-assessment-part.repository.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { QueryHousingAssessmentPartDto } from '../dto/query-housing-assessment-part.dto.js';
import { CreateHousingAssessmentPartDto } from '../dto/create-housing-assessment-part.dto.js';
import { UpdateHousingAssessmentPartDto } from '../dto/update-housing-assessment-part.dto.js';

@Injectable()
export class HousingAssessmentPartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryHousingAssessmentPartDto) {
    const { page = 1, limit = 10, search, partStatus } = query;
    const skip = (page - 1) * limit;

    // Build Prisma dynamic filter
    const where: Prisma.Housing_Assessment_PartWhereInput = {
      OR: [
        // Filter via generic search query parameter (?search=...)
        search
          ? {
              partName: { contains: search, mode: 'insensitive' },
            }
          : {},
        partStatus
          ? {
              partStatus: partStatus, // Sesuaikan dengan nama field di schema.prisma
            }
          : {},
      ],
    };

    const [data, total] = await Promise.all([
      this.prisma.housing_Assessment_Part.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.housing_Assessment_Part.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async create(data: CreateHousingAssessmentPartDto) {
    return this.prisma.housing_Assessment_Part.create({
      data,
    });
  }

  async findById(id: number) {
    return this.prisma.housing_Assessment_Part.findUnique({
      where: { housingAssessmentPartId: id },
    });
  }

  async update(id: number, data: UpdateHousingAssessmentPartDto) {
    return this.prisma.housing_Assessment_Part.update({
      where: { housingAssessmentPartId: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.housing_Assessment_Part.delete({
      where: { housingAssessmentPartId: id },
    });
  }
}
