// src/housing-assessment-part/dto/query-housing-assessment-part.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
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
    enum: PartStatus,
    example: PartStatus.Active,
    description: '',
  })
  @IsOptional()
  @IsEnum(PartStatus)
  partStatus?: PartStatus;
}
