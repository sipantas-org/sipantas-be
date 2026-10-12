import { PartialType } from '@nestjs/swagger';
import { CreateSurveyHousingDetailDto } from './create-survey-housing-detail.dto.js';

export class UpdateSurveyHousingDetailDto extends PartialType(
  CreateSurveyHousingDetailDto,
) {}
