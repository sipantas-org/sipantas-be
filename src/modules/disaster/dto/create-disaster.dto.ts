import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { DisasterStatus } from '../../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDisasterDto {
  @ApiProperty({
    example: 'FLOOD-SUMBAR-2025',
    description: '',
  })
  @IsString()
  @IsNotEmpty()
  disasterCode: string;

  @ApiProperty({
    example: 'Banjir Sumbar 2025',
    description: '',
  })
  @IsString()
  @IsNotEmpty()
  disasterName: string;

  @ApiProperty({
    example: 'Banjir',
    description: '',
  })
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  disasterCategory: string;

  @ApiProperty({
    example: 'Banjir Sumatera Barat November 2025',
    description: '',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Active',
    description: '',
  })
  @IsEnum(DisasterStatus)
  @IsNotEmpty()
  disasterStatus: DisasterStatus;

  @ApiProperty({
    example: '13',
    description: '',
  })
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  provinceId: string;

  @ApiProperty({
    example: '13.06',
    description: '',
  })
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  regencyId?: string;
}
