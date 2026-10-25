import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { DurationUnit } from '../../../generated/prisma/enums.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class QuerySurveyLostDetailDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    description: 'Filter by Survey ID',
    // example: 1,
  })
  @DisplayName('Survey ID')
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  surveyId?: number;

  @ApiPropertyOptional({
    description: 'Filter by Lost Assessment ID',
    // example: 1,
  })
  @DisplayName('Loss Assessment ID')
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  lossAssessmentId?: number;

  @ApiPropertyOptional({
    enum: DurationUnit,
    description: 'Filter by duration unit',
    // example: DurationUnit.Hari,
  })
  @DisplayName('Duration Unit')
  @IsOptional()
  @IsEnum(DurationUnit)
  durationUnit?: DurationUnit;
}
