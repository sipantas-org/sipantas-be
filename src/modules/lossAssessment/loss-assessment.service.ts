import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { LossAssessmentRepository } from './repositories/loss-assessment.repository.js';
import { CreateLossAssessmentDto } from './dto/create-loss-assessment.dto.js';
import { UpdateLossAssessmentDto } from './dto/update-loss-assessment.dto.js';
import { LossAssessmentResponseDto } from './dto/response-loss-assessment.dto.js';
import type { LossAssessment } from './entities/loss-assessment.entity.js';

@Injectable()
export class LossAssessmentService {
  constructor(private readonly repository: LossAssessmentRepository) {}

  async create(dto: CreateLossAssessmentDto) {
    const row = await this.repository.create({
      typeOfLoss: dto.typeOfLoss,
      surveyLossQuestion: dto.surveyLossQuestion,
      lossAssessmentStatus: dto.status,
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

  async update(id: number, dto: UpdateLossAssessmentDto) {
    await this.findOne(id);

    const row = await this.repository.update(id, {
      typeOfLoss: dto.typeOfLoss,
      surveyLossQuestion: dto.surveyLossQuestion,
      lossAssessmentStatus: dto.status,
    });

    return this.toResponse(row);
  }

  async remove(id: number) {
    await this.findOne(id);
    const row = await this.repository.delete(id);
    return this.toResponse(row);
  }

  private toResponse(row: LossAssessment) {
    return plainToInstance(LossAssessmentResponseDto, row, {
      excludeExtraneousValues: true,
    });
  }
}
