// src/housing-assessment-part/dto/query-housing-assessment-part.dto.ts
import { IsOptional, IsString, IsEnum } from 'class-validator';
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
