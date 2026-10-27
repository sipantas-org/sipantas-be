import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HousingDamageAssessmentRepository } from './repositories/housing-damage-assessment.repository.js';
import { CreateHousingDamageAssessmentDto } from './dto/create-housing-damage-assessment.dto.js';
import { UpdateHousingDamageAssessmentDto } from './dto/update-housing-damage-assessment.dto.js';
import { HousingDamageAssessmentResponseDto } from './dto/response-housing-damage-assessment.dto.js';
import type { HousingDamageAssessment } from './entities/housing-damage-assessment.entity.js';

import { QueryHousingDamageAssessmentDto } from './dto/query-housing-damage-assessment.dto.js';

@Injectable()
export class HousingDamageAssessmentService {
  constructor(private readonly repository: HousingDamageAssessmentRepository) {}

  async create(dto: CreateHousingDamageAssessmentDto) {
    const row = await this.repository.create({
      housingAssessmentPartId: dto.idHousingAssessmentPart,
      surveyOrderNumber: dto.surveyOrderNumber,
      surveyDamageQuestion: dto.surveyDamageQuestion,
      surveyScoring: dto.surveyScoring.map((item) => ({
        total: item.total,
        score: item.score,
      })),
      housingDamageAssessmentStatus: dto.status,
    });

    return this.toResponse(row);
  }

  async findAll(query: QueryHousingDamageAssessmentDto) {
    return this.repository.findAll(query);
  }

  async findOne(id: number) {
    const row = await this.repository.findById(id);
    if (!row) {
      throw new NotFoundException('Data not found');
    }
    return this.toResponse(row);
  }

  async update(id: number, dto: UpdateHousingDamageAssessmentDto) {
    await this.findOne(id);

    const row = await this.repository.update(id, {
      housingAssessmentPartId: dto.idHousingAssessmentPart,
      surveyDamageQuestion: dto.surveyDamageQuestion,
      surveyScoring: dto.surveyScoring?.map((item) => ({
        total: item.total,
        score: item.score,
      })),
      housingDamageAssessmentStatus: dto.status,
    });

    return this.toResponse(row);
  }

  async remove(id: number) {
    await this.findOne(id);
    const row = await this.repository.delete(id);
    return this.toResponse(row);
  }

  private toResponse(row: any) {
    return plainToInstance(HousingDamageAssessmentResponseDto, row, {
      excludeExtraneousValues: true,
    });
  }
}
