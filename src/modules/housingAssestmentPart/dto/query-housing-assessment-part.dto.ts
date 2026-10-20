// src/housing-assessment-part/dto/query-housing-assessment-part.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Prisma } from '../../../generated/prisma/client.js';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { PartStatus } from '../../../generated/prisma/enums.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class QueryHousingAssessmentPartDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    example: 'Dinding',
    description: '',
  })
  @DisplayName('Part Name')
  @IsOptional()
  @IsString()
  partName?: string;

  @ApiPropertyOptional({
    example: 'Active',
    description: '',
  })
  @DisplayName('Part Status')
  @IsOptional()
  @IsString()
  @IsEnum(PartStatus)
  partStatus?: PartStatus;

  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    enum: Prisma.HousingAssessmentPartScalarFieldEnum,
    example: 'createdAt',
  })
  @DisplayName('Sort By')
  @IsOptional()
  @IsEnum(Prisma.HousingAssessmentPartScalarFieldEnum)
  sortBy?: Prisma.HousingAssessmentPartScalarFieldEnum;

  @ApiPropertyOptional({
    description: 'Arah pengurutan data',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @DisplayName('Sort Order')
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
