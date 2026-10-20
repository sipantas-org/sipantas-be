import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { DamageCategory } from '../../../generated/prisma/enums.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class QuerySurveyFurnitureDetailDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    description: 'Filter by Survey ID',
    example: 1,
  })
  @DisplayName('Survey ID')
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  surveyId?: number;

  @ApiPropertyOptional({
    description: 'Filter by furniture name',
    example: 'Meja',
  })
  @DisplayName('Furniture Name')
  @IsOptional()
  @IsString()
  furnitureName?: string;

  @ApiPropertyOptional({
    enum: DamageCategory,
    description: 'Filter by damage category',
    example: DamageCategory.Ringan,
  })
  @DisplayName('Damage Category')
  @IsOptional()
  @IsEnum(DamageCategory)
  damageCategory?: DamageCategory;
}
