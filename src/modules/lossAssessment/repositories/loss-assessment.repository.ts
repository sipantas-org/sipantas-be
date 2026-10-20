import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import type { LossAssessment } from '../entities/loss-assessment.entity.js';

@Injectable()
export class LossAssessmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: Prisma.LossAssessmentUncheckedCreateInput,
  ): Promise<LossAssessment> {
    return this.prisma.lossAssessment.create({ data });
  }

  findAll(): Promise<LossAssessment[]> {
    return this.prisma.lossAssessment.findMany({
      orderBy: { lossAssessmentId: 'asc' },
    });
  }

  findById(id: number): Promise<LossAssessment | null> {
    return this.prisma.lossAssessment.findUnique({
      where: { lossAssessmentId: id },
    });
  }

  update(
    id: number,
    data: Prisma.LossAssessmentUncheckedUpdateInput,
  ): Promise<LossAssessment> {
    return this.prisma.lossAssessment.update({
      where: { lossAssessmentId: id },
      data,
    });
  }

  delete(id: number): Promise<LossAssessment> {
    return this.prisma.lossAssessment.delete({
      where: { lossAssessmentId: id },
    });
  }
}
