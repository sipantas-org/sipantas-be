import { PartialType } from '@nestjs/swagger';
import { CreateSurveyComplainDto } from './create-survey-complain.dto.js';

export class UpdateSurveyDto extends PartialType(CreateSurveyComplainDto) {}
