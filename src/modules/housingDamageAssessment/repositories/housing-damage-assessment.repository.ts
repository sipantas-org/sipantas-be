import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import type { HousingDamageAssessment } from '../entities/housing-damage-assessment.entity.js';

@Injectable()
export class HousingDamageAssessmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: Prisma.HousingDamageAssessmentUncheckedCreateInput,
  ): Promise<HousingDamageAssessment> {
    return this.prisma.housingDamageAssessment.create({ data });
  }

  findAll(): Promise<HousingDamageAssessment[]> {
    return this.prisma.housingDamageAssessment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: number): Promise<HousingDamageAssessment | null> {
    return this.prisma.housingDamageAssessment.findUnique({
      where: { housingDamageAssessmentId: id },
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
