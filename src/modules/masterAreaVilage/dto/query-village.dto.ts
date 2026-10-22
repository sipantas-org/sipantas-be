import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Prisma } from '../../../generated/prisma/client.js';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class QueryVillageDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    example: '110101',
    description: 'Filter village berdasarkan districtId',
  })
  @DisplayName('District Id')
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({
    example: '11.05',
    description:
      'Filter village berdasarkan regencyId (regency induk dari district)',
  })
  @DisplayName('Regency Id')
  @IsOptional()
  @IsString()
  regencyId?: string;

  @ApiPropertyOptional({
    example: '11',
    description:
      'Filter village berdasarkan provinceId (province induk dari regency)',
  })
  @DisplayName('Province Id')
  @IsOptional()
  @IsString()
  provinceId?: string;

  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    enum: Prisma.MasterAreaVillageScalarFieldEnum,
    example: 'name',
  })
  @DisplayName('Sort By')
  @IsOptional()
  @IsEnum(Prisma.MasterAreaVillageScalarFieldEnum)
  sortBy?: Prisma.MasterAreaVillageScalarFieldEnum;

  @ApiPropertyOptional({
    description: 'Arah pengurutan data',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @DisplayName('Sort Order')
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
