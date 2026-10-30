import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class QuerySurveyDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    example: 'createdAt',
  })
  @DisplayName('Sort By')
  @IsOptional()
  @IsEnum(Prisma.SurveyScalarFieldEnum)
  sortBy?: Prisma.SurveyScalarFieldEnum;

  @ApiPropertyOptional({
    description: 'Arah pengurutan data',
    enum: ['asc', 'desc'],
  })
  @DisplayName('Sort Order')
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Filter status survei' })
  @DisplayName('Status')
  @IsOptional()
  @IsString()
  surveyStatus?: string;

  @ApiPropertyOptional({ description: 'Filter status survei' })
  @DisplayName('Status')
  @IsOptional()
  @IsString()
  assetName?: string;

  @ApiPropertyOptional({ description: 'Filter status survei' })
  @DisplayName('Status')
  @IsOptional()
  @IsString()
  damageLevel?: string;

  @ApiPropertyOptional({ description: 'Filter berdasarkan ID Surveyor' })
  @DisplayName('Surveyor ID')
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  surveyorId?: number;

  @ApiPropertyOptional({ description: 'Filter berdasarkan ID Disaster' })
  @DisplayName('Disaster ID')
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  disasterId?: number;

  @ApiPropertyOptional({ description: 'Filter berdasarkan ID province' })
  @DisplayName('province ID')
  @IsOptional()
  @Type(() => String)
  @IsString()
  provinceId?: string;

  @ApiPropertyOptional({ description: 'Filter berdasarkan ID regency' })
  @DisplayName('regency ID')
  @IsOptional()
  @Type(() => String)
  @IsString()
  regencyId?: string;

  @ApiPropertyOptional({ description: 'Filter berdasarkan NIK' })
  @DisplayName('NIK')
  @IsOptional()
  @Type(() => String)
  @IsNumberString()
  nik?: string;

  @ApiPropertyOptional({
    description: 'Filter tanggal dibuat awal (YYYY-MM-DD)',
  })
  @DisplayName('Start Date')
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter tanggal dibuat akhir (YYYY-MM-DD)',
  })
  @DisplayName('End Date')
  @IsOptional()
  @IsString()
  endDate?: string;
}

export type RequestListSurveyDto = QuerySurveyDto;
