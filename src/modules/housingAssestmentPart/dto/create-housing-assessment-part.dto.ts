import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PartStatus } from '../../../generated/prisma/enums.js';

export class CreateHousingAssessmentPartDto {
  @IsString()
  @IsNotEmpty()
  partName: string;

  @IsEnum(PartStatus)
  @IsNotEmpty()
  partStatus: PartStatus;
}
