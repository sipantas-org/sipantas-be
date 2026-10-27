import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ComplainStatus } from '../../../generated/prisma/enums.js';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';

export class QuerySurveyComplainDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    description: 'Filter berdasarkan status komplain',
    enum: ComplainStatus,
    example: ComplainStatus.Pending,
  })
  @IsOptional()
  @IsEnum(ComplainStatus)
  status?: ComplainStatus;

  @ApiPropertyOptional({ description: 'Filter berdasarkan NIK' })
  @IsOptional()
  @Type(() => String)
  @IsNumberString()
  nik?: string;

  @ApiPropertyOptional({ description: 'Filter berdasarkan nama pelapor' })
  @IsOptional()
  @IsString()
  complainantName?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan nomor telepon pelapor',
  })
  @IsOptional()
  @IsString()
  complainantPhone?: string;

  @ApiPropertyOptional({
    description: 'Kolom untuk pengurutan',
    default: 'createdAt',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Arah pengurutan (asc atau desc)',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
