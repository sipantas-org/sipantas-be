import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { DurationUnit } from '../../../generated/prisma/enums.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';
import { Type } from 'class-transformer';

export class CreateSurveyLostDetailDto {
  @ApiProperty({ description: 'Lost Assessment ID', example: 1 })
  @DisplayName('Loss Assessment ID')
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  lossAssessmentId: number;

  @ApiProperty({ description: 'Total units', example: 2 })
  @DisplayName('Total Unit')
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  totalUnit: number;

  @ApiProperty({ description: 'Unit price', example: 150000 })
  @DisplayName('Unit Price')
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  unitPrice: number;

  @ApiProperty({ description: 'Duration', example: 3 })
  @DisplayName('Duration')
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    enum: DurationUnit,
    description: 'Duration unit',
    example: DurationUnit.Bulan,
  })
  @DisplayName('Duration Unit')
  @IsEnum(DurationUnit)
  @IsNotEmpty()
  durationUnit: DurationUnit;

  @ApiProperty({
    description: 'Description',
    example: 'Kerugian operasional bulanan',
  })
  @DisplayName('Description')
  @IsOptional()
  @IsString()
  description: string;
}
