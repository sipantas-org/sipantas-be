import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';

export class QuerySurveyDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    example: 'createdAt',
  })
  @IsOptional()
  @IsEnum(Prisma.SurveyScalarFieldEnum)
  sortBy?: Prisma.SurveyScalarFieldEnum;

  @ApiPropertyOptional({
    description: 'Arah pengurutan data',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Filter status survei' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter berdasarkan ID Bencana' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  disasterId?: number;
}

export type RequestListSurveyDto = QuerySurveyDto;
