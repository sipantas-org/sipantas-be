import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class CreateSurveyComplainDto {
  @ApiProperty({
    description: 'ID Survei yang diajukan komplain',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  surveyId: number;

  @ApiPropertyOptional({
    description: 'Nama pelapor/pengadu',
    example: 'Budi Santoso',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  complainantName?: string;

  @ApiPropertyOptional({
    description: 'Nomor telepon/WhatsApp pelapor',
    example: '081234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  complainantPhone?: string;

  @ApiProperty({
    description: 'Rincian keluhan/komplain atas data survei',
    example:
      'Tingkat kerusakan rumah seharusnya masuk kategori Berat bukan Sedang.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    type: () => [SurveyComplainFileItemDto],
    description: 'Daftar berkas atau dokumen pendukung komplain',
  })
  @DisplayName('Complain Files')
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyComplainFileItemDto)
  files?: SurveyComplainFileItemDto[];
}

export class SurveyComplainFileItemDto {
  @ApiProperty({
    example: 'Bukti Kerusakan',
    description: 'Kategori berkas atau dokumen pendukung',
  })
  @DisplayName('Category')
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 'uploads/complains/',
    description: 'Path direktori atau URL penyimpanan file',
  })
  @DisplayName('File Path')
  @IsString()
  @IsNotEmpty()
  filePath: string;

  @ApiProperty({
    example: 'bukti-kerusakan-1.jpg',
    description: 'Nama asli atau nama simpan file',
  })
  @DisplayName('File Name')
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
