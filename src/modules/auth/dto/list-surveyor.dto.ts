import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SurveyorStatus } from '../../../generated/prisma/enums.js';

export class ListSurveyorDto {
  @ApiPropertyOptional({
    enum: SurveyorStatus,
    example: 'Pending',
    description: 'Filter surveyor berdasarkan status akun',
  })
  @IsOptional()
  @IsEnum(SurveyorStatus)
  status?: 'Pending' | 'Active' | 'Inactive' | 'Rejected';

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
