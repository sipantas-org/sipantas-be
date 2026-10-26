import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSurveyDto } from './create-survey.dto.js';

export class UpdateSurveyDto extends PartialType(
  OmitType(CreateSurveyDto, ['surveyStatus', 'surveyorId'] as const),
) {}
