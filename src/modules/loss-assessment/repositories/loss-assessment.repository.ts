import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import type { Loss_Assessment } from '../entities/loss-assessment.entity.js';

@Injectable()
export class LossAssessmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: Prisma.Loss_AssessmentUncheckedCreateInput,
  ): Promise<Loss_Assessment> {
    return this.prisma.loss_Assessment.create({ data });
  }

  findAll(): Promise<Loss_Assessment[]> {
    return this.prisma.loss_Assessment.findMany({
      orderBy: { Created_At: 'desc' },
    });
  }

  findById(id: number): Promise<Loss_Assessment | null> {
    return this.prisma.loss_Assessment.findUnique({
      where: { ID_Loss_Assessment: id },
    });
  }

  update(
    id: number,
    data: Prisma.Loss_AssessmentUncheckedUpdateInput,
  ): Promise<Loss_Assessment> {
    return this.prisma.loss_Assessment.update({
      where: { ID_Loss_Assessment: id },
      data,
    });
  }

  delete(id: number): Promise<Loss_Assessment> {
    return this.prisma.loss_Assessment.delete({
      where: { ID_Loss_Assessment: id },
    });
  }
}
