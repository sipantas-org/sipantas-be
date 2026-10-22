import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Prisma } from '../../../generated/prisma/client.js';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class QueryRegencyDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    example: '11',
    description: 'Filter regency berdasarkan provinceId',
  })
  @DisplayName('Province Id')
  @IsOptional()
  @IsString()
  provinceId?: string;

  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    enum: Prisma.MasterAreaRegencyScalarFieldEnum,
    example: 'name',
  })
  @DisplayName('Sort By')
  @IsOptional()
  @IsEnum(Prisma.MasterAreaRegencyScalarFieldEnum)
  sortBy?: Prisma.MasterAreaRegencyScalarFieldEnum;

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
