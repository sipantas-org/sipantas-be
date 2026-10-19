import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { DisasterStatus } from '../../../generated/prisma/enums.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDisasterDto {
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
    example: '2025-05',
    description: 'Tahun dan bulan kejadian bencana dengan format YYYY-MM',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'disasterDate harus berformat YYYY-MM',
  })
  disasterDate: string;

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
