import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { HousingDamageAssessmentStatus } from '../../../generated/prisma/enums.js';

export class SurveyScoringItemDto {
  @ApiProperty({ example: 10, description: 'Total skor maksimal pertanyaan' })
  @IsInt()
  @Min(0)
  total!: number;

  @ApiProperty({ example: 7, description: 'Skor yang diperoleh surveyor' })
  @IsInt()
  @Min(0)
  score!: number;
}

export class CreateHousingDamageAssessmentDto {
  @ApiProperty({
    example: 1,
    description: 'ID Housing_Assessment_Part yang disurvei',
  })
  @IsInt()
  idHousingAssessmentPart!: number;

  @ApiProperty({
    example: 'Apakah dinding rumah mengalami keretakan struktural?',
    description: 'Pertanyaan survei kerusakan',
  })
  @IsString()
  @IsNotEmpty()
  surveyDamageQuestion!: string;

  @ApiProperty({
    type: [SurveyScoringItemDto],
    description: 'Daftar skor hasil survei',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyScoringItemDto)
  surveyScoring!: SurveyScoringItemDto[];

  @ApiProperty({
    enum: HousingDamageAssessmentStatus,
    example: HousingDamageAssessmentStatus.Active,
  })
  @IsEnum(HousingDamageAssessmentStatus)
  status!: HousingDamageAssessmentStatus;
}
