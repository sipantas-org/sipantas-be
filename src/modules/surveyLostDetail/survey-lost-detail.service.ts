import { Injectable, NotFoundException } from '@nestjs/common';
import { SurveyLostDetailRepository } from './repositories/survey-lost-detail.repository.js';
import { CreateSurveyLostDetailDto } from './dto/create-survey-lost-detail.dto.js';
import { UpdateSurveyLostDetailDto } from './dto/update-survey-lost-detail.dto.js';
import { QuerySurveyLostDetailDto } from './dto/query-survey-lost-detail.dto.js';

@Injectable()
export class SurveyLostDetailService {
  constructor(
    private readonly surveyLostDetailRepository: SurveyLostDetailRepository,
  ) {}

  async create(createDto: CreateSurveyLostDetailDto) {
    return this.surveyLostDetailRepository.create(createDto);
  }

  async findAll(query: QuerySurveyLostDetailDto) {
    return this.surveyLostDetailRepository.findAll(query);
  }

  async findOne(id: number) {
    const detail = await this.surveyLostDetailRepository.findById(id);
    if (!detail) {
      throw new NotFoundException('Data not found');
    }
    return detail;
  }

  async update(id: number, updateDto: UpdateSurveyLostDetailDto) {
    await this.findOne(id);
    return this.surveyLostDetailRepository.update(id, updateDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.surveyLostDetailRepository.delete(id);
  }
}
