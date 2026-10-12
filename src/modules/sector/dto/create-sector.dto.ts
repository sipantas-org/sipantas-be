import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SectorStatus } from '../../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSectorDto {
  @ApiProperty({
    example: 'Perumahan',
    description: '',
  })
  @IsString()
  @IsNotEmpty()
  sectorName: string;

  @ApiProperty({
    example: 1,
    description: '',
  })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Active',
    description: '',
  })
  @IsEnum(SectorStatus)
  status: SectorStatus;
}
