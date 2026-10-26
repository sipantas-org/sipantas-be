import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class CreateSurveyHousingDetailDto {
  @ApiProperty({ description: 'Housing Damage Assessment ID', example: 1 })
  @DisplayName('Housing Damage Assessment ID')
  @IsInt()
  @IsNotEmpty()
  housingDamageAssessmentId: number;

  @ApiProperty({ description: 'Total units', example: 2 })
  @DisplayName('Total Unit')
  @IsInt()
  @IsNotEmpty()
  totalUnit: number;

  @ApiProperty({ description: 'Score', example: 15 })
  @DisplayName('Score')
  @IsInt()
  @IsNotEmpty()
  score: number;
}
