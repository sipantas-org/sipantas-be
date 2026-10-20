import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class QueryHousingDamageAssessmentDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    description: 'Filter berdasarkan ID bagian/komponen rumah',
    example: 1,
  })
  @DisplayName('Housing Assessment Part ID')
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  housingAssessmentPartId?: number;

  @ApiPropertyOptional({
    description: 'Filter pencarian pertanyaan survei kerusakan',
    example: 'Retak',
  })
  @DisplayName('Survey Damage Question')
  @IsOptional()
  @IsString()
  surveyDamageQuestion?: string;

  @ApiPropertyOptional({
    description: 'Filter status penilaian kerusakan (Active / Inactive)',
    example: 'Active',
  })
  @DisplayName('Housing Damage Assessment Status')
  @IsOptional()
  @IsString()
  housingDamageAssessmentStatus?: string;

  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    example: 'createdAt',
  })
  @DisplayName('Sort By')
  @IsOptional()
  @IsEnum(Prisma.HousingDamageAssessmentScalarFieldEnum)
  sortBy?: Prisma.HousingDamageAssessmentScalarFieldEnum;

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
