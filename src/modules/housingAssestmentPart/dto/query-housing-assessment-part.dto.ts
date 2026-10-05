// src/housing-assessment-part/dto/query-housing-assessment-part.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { PartStatus } from '../../../generated/prisma/enums.js';

export class QueryHousingAssessmentPartDto extends QueryDefaultDto {
  @IsOptional()
  @IsString()
  partStatus?: PartStatus;
}
