import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { SurveyStatus } from '../../../generated/prisma/enums.js';

export class UpdateSurveyStatusDto {
  @ApiProperty({
    enum: SurveyStatus,
    enumName: 'SurveyStatus',
    example: SurveyStatus.Pending,
    description: 'Status baru survei',
  })
  @IsEnum(SurveyStatus)
  surveyStatus: SurveyStatus;

  @ApiPropertyOptional({
    description: 'Source of Budgetting',
    example: 'APBN',
  })
  @IsOptional()
  @IsString()
  sourceOfBudgetting?: string;
}
