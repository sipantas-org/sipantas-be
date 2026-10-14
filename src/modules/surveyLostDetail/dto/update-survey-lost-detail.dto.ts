import { PartialType } from '@nestjs/swagger';
import { CreateSurveyLostDetailDto } from './create-survey-lost-detail.dto.js';

export class UpdateSurveyLostDetailDto extends PartialType(
  CreateSurveyLostDetailDto,
) {}
