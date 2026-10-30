import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { AdminStatus } from '../../../generated/prisma/enums.js';

export class ListAdminDto {
  @ApiPropertyOptional({
    enum: AdminStatus,
    example: 'Active',
    description: 'Filter admin berdasarkan status akun',
  })
  @IsOptional()
  @IsEnum(AdminStatus)
  status?: 'Active' | 'Inactive';

  @ApiPropertyOptional({
    example: '',
    description: 'Filter admin berdasarkan NIP',
  })
  @IsOptional()
  @IsString()
  nip?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Filter admin berdasarkan nama lengkap',
  })
  @IsOptional()
  @IsString()
  nama?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    minimum: 1,
    description: 'Halaman data yang ingin ditampilkan',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    description: 'Jumlah data per halaman',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
