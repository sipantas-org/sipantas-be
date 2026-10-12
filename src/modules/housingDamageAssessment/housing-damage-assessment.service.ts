import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HousingDamageAssessmentRepository } from './repositories/housing-damage-assessment.repository.js';
import { CreateHousingDamageAssessmentDto } from './dto/create-housing-damage-assessment.dto.js';
import { UpdateHousingDamageAssessmentDto } from './dto/update-housing-damage-assessment.dto.js';
import { HousingDamageAssessmentResponseDto } from './dto/response-housing-damage-assessment.dto.js';
import type { Housing_Damage_Assessment } from './entities/housing-damage-assessment.entity.js';

@Injectable()
export class HousingDamageAssessmentService {
  constructor(
    private readonly repository: HousingDamageAssessmentRepository,
  ) {}

  async create(dto: CreateHousingDamageAssessmentDto) {
    const row = await this.repository.create({
      ID_Housing_Assessment_Part: dto.idHousingAssessmentPart,
      Survey_Damage_Question: dto.surveyDamageQuestion,
      Survey_Scoring: dto.surveyScoring.map((item) => ({
        total: item.total,
        score: item.score,
      })),
      Status: dto.status,
    });

    return this.toResponse(row);
  }

  async findAll() {
    const rows = await this.repository.findAll();
    return rows.map((row) => this.toResponse(row));
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
      ID_Housing_Assessment_Part: dto.idHousingAssessmentPart,
      Survey_Damage_Question: dto.surveyDamageQuestion,
      Survey_Scoring: dto.surveyScoring?.map((item) => ({
        total: item.total,
        score: item.score,
      })),
      Status: dto.status,
    });

    return this.toResponse(row);
  }

  async remove(id: number) {
    await this.findOne(id);
    const row = await this.repository.delete(id);
    return this.toResponse(row);
  }

  private toResponse(row: Housing_Damage_Assessment) {
    return plainToInstance(HousingDamageAssessmentResponseDto, row, {
      excludeExtraneousValues: true,
    });
  }
}
