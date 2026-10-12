import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PartStatus } from '../../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHousingAssessmentPartDto {
  @ApiProperty({
    example: 'Dinding',
    description: '',
  })
  @IsString()
  @IsNotEmpty()
  partName: string;

  @ApiProperty({
    example: 'Dinding',
    description: '',
  })
  @IsString()
  @IsNotEmpty()
  partDescription: string;

  @ApiProperty({
    example: 'Active',
    description: '',
  })
  @IsEnum(PartStatus)
  @IsNotEmpty()
  partStatus: PartStatus;
}
