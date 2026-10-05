import { PartialType } from '@nestjs/mapped-types';
import { CreateHousingAssessmentPartDto } from './create-housing-assessment-part.dto.js';

export class UpdateHousingAssessmentPartDto extends PartialType(
  CreateHousingAssessmentPartDto,
) {}
