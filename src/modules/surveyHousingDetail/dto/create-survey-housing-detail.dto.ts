import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSurveyHousingDetailDto {
  @ApiProperty({ description: 'Housing Damage Assessment ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  housingDamageAssessmentId: number;

  @ApiProperty({ description: 'Total units', example: 2 })
  @IsInt()
  @IsNotEmpty()
  totalUnit: number;

  @ApiProperty({ description: 'Score', example: 85 })
  @IsInt()
  @IsNotEmpty()
  score: number;
}
