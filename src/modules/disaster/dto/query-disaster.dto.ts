// src/housing-assessment-part/dto/query-housing-assessment-part.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { DisasterStatus } from '../../../generated/prisma/enums.js';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDisasterDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    example: 'FLOOD',
    description: '',
  })
  @IsOptional()
  @IsString()
  disasterCode?: string;

  @ApiPropertyOptional({
    example: 'Banjir',
    description: '',
  })
  @IsOptional()
  @IsString()
  disasterName?: string;

  @ApiPropertyOptional({
    example: 'Banjir',
    description: '',
  })
  @IsOptional()
  @IsString()
  disasterCategory?: string;

  @IsOptional()
  @IsString()
  disasterStatus?: DisasterStatus;
}
