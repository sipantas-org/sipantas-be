import { PartialType } from '@nestjs/swagger';
import { CreateHousingDamageAssessmentDto } from './create-housing-damage-assessment.dto.js';

export class UpdateHousingDamageAssessmentDto extends PartialType(
  CreateHousingDamageAssessmentDto,
) {}
