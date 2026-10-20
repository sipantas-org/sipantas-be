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
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class CreateDisasterDto {
  @ApiProperty({
    example: 'Banjir Sumbar 2025',
    description: '',
  })
  @DisplayName('Disaster Name')
  @IsString()
  @IsNotEmpty()
  disasterName: string;

  @ApiProperty({
    example: 'Banjir',
    description: '',
  })
  @DisplayName('Disaster Category')
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  disasterCategory: string;

  @ApiProperty({
    example: 'Banjir Sumatera Barat November 2025',
    description: '',
  })
  @DisplayName('Description')
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Active',
    description: '',
  })
  @DisplayName('Disaster Status')
  @IsEnum(DisasterStatus)
  @IsNotEmpty()
  disasterStatus: DisasterStatus;

  @ApiProperty({
    example: '2025-05',
    description: 'Tahun dan bulan kejadian bencana dengan format YYYY-MM',
  })
  @DisplayName('Disaster Date')
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
  @DisplayName('Province ID')
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  provinceId: string;

  @ApiProperty({
    example: '13.06',
    description: '',
  })
  @DisplayName('Regency ID')
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  regencyId?: string;
}
