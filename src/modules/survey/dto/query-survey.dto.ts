import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
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
  status?: string;

  @ApiPropertyOptional({ description: 'Filter berdasarkan ID Bencana' })
  @DisplayName('Disaster ID')
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  disasterId?: number;
}

export type RequestListSurveyDto = QuerySurveyDto;
