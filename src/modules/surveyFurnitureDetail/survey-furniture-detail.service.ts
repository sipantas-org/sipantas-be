import { Injectable, NotFoundException } from '@nestjs/common';
import { SurveyFurnitureDetailRepository } from './repositories/survey-furniture-detail.repository.js';
import { CreateSurveyFurnitureDetailDto } from './dto/create-survey-furniture-detail.dto.js';
import { UpdateSurveyFurnitureDetailDto } from './dto/update-survey-furniture-detail.dto.js';
import { QuerySurveyFurnitureDetailDto } from './dto/query-survey-furniture-detail.dto.js';

@Injectable()
export class SurveyFurnitureDetailService {
  constructor(
    private readonly surveyFurnitureDetailRepository: SurveyFurnitureDetailRepository,
  ) {}

  async create(createDto: CreateSurveyFurnitureDetailDto) {
    return this.surveyFurnitureDetailRepository.create(createDto);
  }

  async findAll(query: QuerySurveyFurnitureDetailDto) {
    return this.surveyFurnitureDetailRepository.findAll(query);
  }

  async findOne(id: number) {
    const detail = await this.surveyFurnitureDetailRepository.findById(id);
    if (!detail) {
      throw new NotFoundException('Data not found');
    }
    return detail;
  }

  async update(id: number, updateDto: UpdateSurveyFurnitureDetailDto) {
    await this.findOne(id);
    return this.surveyFurnitureDetailRepository.update(id, updateDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.surveyFurnitureDetailRepository.delete(id);
  }
}
