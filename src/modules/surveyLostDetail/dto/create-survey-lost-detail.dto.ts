import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DurationUnit } from '../../../generated/prisma/enums.js';

export class CreateSurveyLostDetailDto {
  @ApiProperty({ description: 'Lost Assessment ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  lossAssessmentId: number;

  @ApiProperty({ description: 'Total units', example: 2 })
  @IsInt()
  @IsNotEmpty()
  totalUnit: number;

  @ApiProperty({ description: 'Unit price', example: 150000 })
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @ApiProperty({ description: 'Duration', example: 3 })
  @IsInt()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    enum: DurationUnit,
    description: 'Duration unit',
    example: DurationUnit.Bulan,
  })
  @IsEnum(DurationUnit)
  @IsNotEmpty()
  durationUnit: DurationUnit;

  @ApiProperty({
    description: 'Description',
    example: 'Kerugian operasional bulanan',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
