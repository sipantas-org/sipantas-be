import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SectorStatus } from '../../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class CreateSectorDto {
  @ApiProperty({
    example: 'Perumahan',
    description: '',
  })
  @DisplayName('Sector Name')
  @IsString()
  @IsNotEmpty()
  sectorName: string;

  @ApiProperty({
    example: 1,
    description: '',
  })
  @DisplayName('Parent ID')
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiProperty({
    example: '',
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
  @DisplayName('Status')
  @IsEnum(SectorStatus)
  status: SectorStatus;
}
