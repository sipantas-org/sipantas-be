// src/housing-assessment-part/dto/query-housing-assessment-part.dto.ts
import { IsOptional, IsString, IsEnum, Matches } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { DisasterStatus } from '../../../generated/prisma/enums.js';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '../../../generated/prisma/client.js';

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

  @ApiPropertyOptional({
    example: '2025-05',
    description:
      'Filter tahun dan bulan kejadian bencana dengan format YYYY-MM',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'disasterDate harus berformat YYYY-MM',
  })
  disasterDate?: string;

  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    example: 'createdAt',
  })
  @IsOptional()
  @IsEnum(Prisma.DisasterScalarFieldEnum)
  sortBy?: Prisma.DisasterScalarFieldEnum;

  @ApiPropertyOptional({
    description: 'Arah pengurutan data',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
