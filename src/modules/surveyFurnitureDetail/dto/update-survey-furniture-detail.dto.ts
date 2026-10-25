import { PartialType } from '@nestjs/swagger';
import { CreateSurveyFurnitureDetailDto } from './create-survey-furniture-detail.dto.js';

export class UpdateSurveyFurnitureDetailDto extends PartialType(
  CreateSurveyFurnitureDetailDto,
) {}
