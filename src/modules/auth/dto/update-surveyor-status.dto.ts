import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SurveyorStatus } from '../../../generated/prisma/enums.js';

const allowedStatusUpdate = [SurveyorStatus.Active, SurveyorStatus.Inactive];
export class UpdateSurveyorStatusDto {
  @ApiProperty({ enum: SurveyorStatus, example: SurveyorStatus.Active })
  @IsEnum(allowedStatusUpdate)
  status: SurveyorStatus;
}
