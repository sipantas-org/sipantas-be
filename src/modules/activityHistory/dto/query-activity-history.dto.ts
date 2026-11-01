import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

// Kolom yang boleh dipakai untuk sorting, termasuk name/userType.
export const ACTIVITY_HISTORY_SORT_FIELDS = [
  ...Object.values(Prisma.ActivityHistoryScalarFieldEnum),
  'name',
  'userType',
] as const;

export type ActivityHistorySortField =
  (typeof ACTIVITY_HISTORY_SORT_FIELDS)[number];

export const ACTIVITY_HISTORY_USER_TYPES = [
  'Surveyor',
  'Administrator',
  'Monitoring',
] as const;

export type ActivityHistoryUserType =
  (typeof ACTIVITY_HISTORY_USER_TYPES)[number];

export class RequestListActivityDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    description: 'Nama field/kolom yang digunakan untuk pengurutan data',
    enum: ACTIVITY_HISTORY_SORT_FIELDS,
    default: 'createdAt',
    example: 'createdAt',
  })
  @DisplayName('Sort By')
  @IsOptional()
  @IsIn(ACTIVITY_HISTORY_SORT_FIELDS)
  sortBy?: ActivityHistorySortField = 'createdAt';

  @ApiPropertyOptional({
    description: 'Arah pengurutan data',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @DisplayName('Sort Order')
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

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

  @ApiPropertyOptional({
    description: 'Filter berdasarkan nama pelaku aktivitas (surveyor/admin)',
  })
  @DisplayName('Name')
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan jenis pelaku',
    enum: ACTIVITY_HISTORY_USER_TYPES,
  })
  @DisplayName('User Type')
  @IsOptional()
  @IsIn(ACTIVITY_HISTORY_USER_TYPES)
  userType?: ActivityHistoryUserType;
}
