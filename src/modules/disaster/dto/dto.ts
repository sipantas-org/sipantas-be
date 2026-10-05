// src/housing-assessment-part/dto/query-housing-assessment-part.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { DisasterStatus } from '../../../generated/prisma/enums.js';

export class QueryDisasterDto extends QueryDefaultDto {
  @IsOptional()
  @IsString()
  disasterStatus?: DisasterStatus;
}
