import { PartialType } from '@nestjs/mapped-types';
import { CreateHousingDamageAssessmentDto } from './create-housing-damage-assessment.dto.js';

export class UpdateHousingDamageAssessmentDto extends PartialType(
  CreateHousingDamageAssessmentDto,
) {}
