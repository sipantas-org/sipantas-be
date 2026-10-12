import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { DamageCategory } from '../../../generated/prisma/enums.js';

export class QuerySurveyFurnitureDetailDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    description: 'Filter by Survey ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  surveyId?: number;

  @ApiPropertyOptional({
    description: 'Filter by furniture name',
    example: 'Meja',
  })
  @IsOptional()
  @IsString()
  furnitureName?: string;

  @ApiPropertyOptional({
    enum: DamageCategory,
    description: 'Filter by damage category',
    example: DamageCategory.Ringan,
  })
  @IsOptional()
  @IsEnum(DamageCategory)
  damageCategory?: DamageCategory;
}
