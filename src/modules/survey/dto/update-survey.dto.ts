import { PartialType } from '@nestjs/swagger';
import { CreateSurveyDto } from './create-survey.dto.js';

export class UpdateSurveyDto extends PartialType(CreateSurveyDto) {}
