import { PartialType } from '@nestjs/mapped-types';
import { CreateLossAssessmentDto } from './create-loss-assessment.dto.js';

export class UpdateLossAssessmentDto extends PartialType(
  CreateLossAssessmentDto,
) {}
