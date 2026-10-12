import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  LossAssessmentStatus,
  LossAssessmentTypeOfLoss,
} from '../../../generated/prisma/enums.js';

export class CreateLossAssessmentDto {
  @ApiProperty({
    enum: LossAssessmentTypeOfLoss,
    example: LossAssessmentTypeOfLoss.additional_cost,
  })
  @IsEnum(LossAssessmentTypeOfLoss)
  typeOfLoss!: LossAssessmentTypeOfLoss;

  @ApiProperty({
    example: 'Berapa estimasi kerugian material akibat bencana?',
    description: 'Pertanyaan survei kerugian',
  })
  @IsString()
  @IsNotEmpty()
  surveyLossQuestion!: string;

  @ApiProperty({
    enum: LossAssessmentStatus,
    example: LossAssessmentStatus.Active,
  })
  @IsEnum(LossAssessmentStatus)
  status!: LossAssessmentStatus;
}
