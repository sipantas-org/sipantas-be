import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  LossAssessmentStatus,
  LossAssessmentTypeOfLoss,
} from '../../../generated/prisma/enums.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class CreateLossAssessmentDto {
  @ApiProperty({
    enum: LossAssessmentTypeOfLoss,
    example: LossAssessmentTypeOfLoss.additional_cost,
  })
  @DisplayName('Type of Loss')
  @IsEnum(LossAssessmentTypeOfLoss)
  typeOfLoss!: LossAssessmentTypeOfLoss;

  @ApiProperty({
    example: 'Berapa estimasi kerugian material akibat bencana?',
    description: 'Pertanyaan survei kerugian',
  })
  @DisplayName('Survey Loss Question')
  @IsString()
  @IsNotEmpty()
  surveyLossQuestion!: string;

  @ApiProperty({
    enum: LossAssessmentStatus,
    example: LossAssessmentStatus.Active,
  })
  @DisplayName('Status')
  @IsEnum(LossAssessmentStatus)
  status!: LossAssessmentStatus;
}
