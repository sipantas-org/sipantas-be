import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import type { Housing_Damage_Assessment } from '../entities/housing-damage-assessment.entity.js';

@Injectable()
export class HousingDamageAssessmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: Prisma.Housing_Damage_AssessmentUncheckedCreateInput,
  ): Promise<Housing_Damage_Assessment> {
    return this.prisma.housing_Damage_Assessment.create({ data });
  }

  findAll(): Promise<Housing_Damage_Assessment[]> {
    return this.prisma.housing_Damage_Assessment.findMany({
      orderBy: { Created_At: 'desc' },
    });
  }

  findById(id: number): Promise<Housing_Damage_Assessment | null> {
    return this.prisma.housing_Damage_Assessment.findUnique({
      where: { ID_Housing_Damage_Assessment: id },
    });
  }

  update(
    id: number,
    data: Prisma.Housing_Damage_AssessmentUncheckedUpdateInput,
  ): Promise<Housing_Damage_Assessment> {
    return this.prisma.housing_Damage_Assessment.update({
      where: { ID_Housing_Damage_Assessment: id },
      data,
    });
  }

  delete(id: number): Promise<Housing_Damage_Assessment> {
    return this.prisma.housing_Damage_Assessment.delete({
      where: { ID_Housing_Damage_Assessment: id },
    });
  }
}
