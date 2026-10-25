import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Prisma } from '../../../generated/prisma/client.js';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class QueryDistrictDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    example: '1101',
    description: 'Filter district berdasarkan regencyId',
  })
  @DisplayName('Regency Id')
  @IsOptional()
  @IsString()
  regencyId?: string;

  @ApiPropertyOptional({
    example: '11',
    description:
      'Filter district berdasarkan provinceId (province induk dari regency)',
  })
  @DisplayName('Province Id')
  @IsOptional()
  @IsString()
  provinceId?: string;

  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    enum: Prisma.MasterAreaDistrictScalarFieldEnum,
    example: 'name',
  })
  @DisplayName('Sort By')
  @IsOptional()
  @IsEnum(Prisma.MasterAreaDistrictScalarFieldEnum)
  sortBy?: Prisma.MasterAreaDistrictScalarFieldEnum;

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
