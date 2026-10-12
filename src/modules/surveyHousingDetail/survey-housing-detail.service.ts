import { Injectable, NotFoundException } from '@nestjs/common';
import { SurveyHousingDetailRepository } from './repositories/survey-housing-detail.repository.js';
import { CreateSurveyHousingDetailDto } from './dto/create-survey-housing-detail.dto.js';
import { UpdateSurveyHousingDetailDto } from './dto/update-survey-housing-detail.dto.js';
import { QuerySurveyHousingDetailDto } from './dto/query-survey-housing-detail.dto.js';

@Injectable()
export class SurveyHousingDetailService {
  constructor(
    private readonly surveyHousingDetailRepository: SurveyHousingDetailRepository,
  ) {}

  async create(createDto: CreateSurveyHousingDetailDto) {
    return this.surveyHousingDetailRepository.create(createDto);
  }

  async findAll(query: QuerySurveyHousingDetailDto) {
    return this.surveyHousingDetailRepository.findAll(query);
  }

  async findOne(id: number) {
    const detail = await this.surveyHousingDetailRepository.findById(id);
    if (!detail) {
      throw new NotFoundException('Data not found');
    }
    return detail;
  }

  async update(id: number, updateDto: UpdateSurveyHousingDetailDto) {
    await this.findOne(id);
    return this.surveyHousingDetailRepository.update(id, updateDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.surveyHousingDetailRepository.delete(id);
  }
}
