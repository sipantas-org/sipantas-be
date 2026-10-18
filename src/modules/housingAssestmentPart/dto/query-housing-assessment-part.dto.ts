// src/housing-assessment-part/dto/query-housing-assessment-part.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Prisma } from '../../../generated/prisma/client.js';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { PartStatus } from '../../../generated/prisma/enums.js';

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

  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    enum: Prisma.HousingAssessmentPartScalarFieldEnum,
    example: 'createdAt',
  })
  @IsOptional()
  @IsEnum(Prisma.HousingAssessmentPartScalarFieldEnum)
  sortBy?: Prisma.HousingAssessmentPartScalarFieldEnum;

  @ApiPropertyOptional({
    description: 'Arah pengurutan data',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
