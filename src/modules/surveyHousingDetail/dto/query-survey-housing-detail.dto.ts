import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class QuerySurveyHousingDetailDto extends QueryDefaultDto {
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
    description: 'Filter by Housing Damage Assessment ID',
    example: 1,
  })
  @DisplayName('Housing Damage Assessment ID')
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  housingDamageAssessmentId?: number;
}
