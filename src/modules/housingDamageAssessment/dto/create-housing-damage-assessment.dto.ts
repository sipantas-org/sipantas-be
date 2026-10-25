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
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class SurveyScoringItemDto {
  @ApiProperty({ example: 10, description: 'Total skor maksimal pertanyaan' })
  @DisplayName('Total Score')
  @IsInt()
  @Min(0)
  total!: number;

  @ApiProperty({ example: 7, description: 'Skor yang diperoleh surveyor' })
  @DisplayName('Score')
  @IsInt()
  @Min(0)
  score!: number;
}

export class CreateHousingDamageAssessmentDto {
  @ApiProperty({
    example: 1,
    description: 'ID HousingAssessmentPart yang disurvei',
  })
  @DisplayName('Housing Assessment Part ID')
  @IsInt()
  idHousingAssessmentPart!: number;

  @ApiProperty({
    example: 'Apakah dinding rumah mengalami keretakan struktural?',
    description: 'Pertanyaan survei kerusakan',
  })
  @DisplayName('Survey Damage Question')
  @IsString()
  @IsNotEmpty()
  surveyDamageQuestion!: string;

  @ApiProperty({
    type: [SurveyScoringItemDto],
    description: 'Daftar skor hasil survei',
  })
  @DisplayName('Survey Scoring')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyScoringItemDto)
  surveyScoring!: SurveyScoringItemDto[];

  @ApiProperty({
    enum: HousingDamageAssessmentStatus,
    example: HousingDamageAssessmentStatus.Active,
  })
  @DisplayName('Status')
  @IsEnum(HousingDamageAssessmentStatus)
  status!: HousingDamageAssessmentStatus;
}
