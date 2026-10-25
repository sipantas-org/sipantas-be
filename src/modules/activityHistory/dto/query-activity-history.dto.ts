import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';

export class RequestListActivityDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    example: 'createdAt',
  })
  @IsOptional()
  @IsEnum(Prisma.ActivityHistoryScalarFieldEnum)
  sortBy?: Prisma.ActivityHistoryScalarFieldEnum;

  @ApiPropertyOptional({
    description: 'Arah pengurutan data',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Filter berdasarkan modul' })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiPropertyOptional({ description: 'Filter berdasarkan ID Admin' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  adminId?: number;

  @ApiPropertyOptional({ description: 'Filter berdasarkan ID User / Surveyor' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiPropertyOptional({ description: 'Pencarian deskripsi aktivitas' })
  @IsOptional()
  @IsString()
  activity?: string;
}
