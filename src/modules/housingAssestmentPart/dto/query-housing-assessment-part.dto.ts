// src/housing-assessment-part/dto/query-housing-assessment-part.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { PartStatus } from '../../../generated/prisma/enums.js';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryHousingAssessmentPartDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    example: 'Dinding',
    description: '',
  })
  @IsOptional()
  @IsString()
  partName?: string;

  @ApiPropertyOptional({
    example: 'FLOOD',
    description: '',
  })
  @IsOptional()
  @IsString()
  partStatus?: PartStatus;
}
