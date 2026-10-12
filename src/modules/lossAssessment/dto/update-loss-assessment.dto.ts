import { PartialType } from '@nestjs/swagger';
import { CreateLossAssessmentDto } from './create-loss-assessment.dto.js';

export class UpdateLossAssessmentDto extends PartialType(
  CreateLossAssessmentDto,
) {}
