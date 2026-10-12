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
  @IsInt()
  @Min(0)
  total!: number;

  @IsInt()
  @Min(0)
  score!: number;
}

export class CreateHousingDamageAssessmentDto {
  @IsInt()
  idHousingAssessmentPart!: number;

  @IsString()
  @IsNotEmpty()
  surveyDamageQuestion!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyScoringItemDto)
  surveyScoring!: SurveyScoringItemDto[];

  @IsEnum(HousingDamageAssessmentStatus)
  status!: HousingDamageAssessmentStatus;
}
