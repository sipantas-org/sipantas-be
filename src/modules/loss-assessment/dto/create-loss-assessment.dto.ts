import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  LossAssessmentStatus,
  LossAssessmentTypeOfLoss,
} from '../../../generated/prisma/enums.js';

export class CreateLossAssessmentDto {
  @IsEnum(LossAssessmentTypeOfLoss)
  typeOfLoss!: LossAssessmentTypeOfLoss;

  @IsString()
  @IsNotEmpty()
  surveyLossQuestion!: string;

  @IsEnum(LossAssessmentStatus)
  status!: LossAssessmentStatus;
}
