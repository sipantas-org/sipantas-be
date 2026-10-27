import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ComplainAction,
  ComplainStatus,
  SurveyStatus,
} from '../../../generated/prisma/enums.js';

export class SurveyComplainDocumentResponseDto {
  @ApiPropertyOptional({ example: 1 })
  documentId?: number;

  @ApiProperty({ example: 'Bukti Kerusakan' })
  category: string;

  @ApiProperty({ example: 'uploads/complains/bukti-1.jpg' })
  filePath: string;

  @ApiProperty({ example: 'bukti-1.jpg' })
  fileName: string;
}

export class ComplainSurveyDetailResponseDto {
  @ApiProperty({ example: 1 })
  surveyId: number;

  @ApiProperty({ example: '3201123456780001' })
  nik: string;

  @ApiProperty({ example: 'Rumah Pak Budi' })
  assetName: string;

  @ApiProperty({ enum: SurveyStatus, example: SurveyStatus.Pending })
  surveyStatus: SurveyStatus;
}

export class ComplainResponseDto {
  @ApiProperty({ example: 1 })
  complainId: number;

  @ApiProperty({ example: 1 })
  surveyId: number;

  @ApiPropertyOptional({ example: 'Budi Santoso' })
  complainantName?: string | null;

  @ApiPropertyOptional({ example: '3201123456780001' })
  complainantNik?: string | null;

  @ApiPropertyOptional({ example: '081234567890' })
  complainantPhone?: string | null;

  @ApiProperty({
    example:
      'Tingkat kerusakan rumah seharusnya masuk kategori Berat bukan Sedang.',
  })
  description: string;

  @ApiProperty({ enum: ComplainStatus, example: ComplainStatus.Pending })
  status: ComplainStatus;

  @ApiPropertyOptional({
    enum: ComplainAction,
    example: ComplainAction.Resolved,
  })
  action?: ComplainAction | null;

  @ApiPropertyOptional({
    example:
      'Akan dilakukan investigasi dan verifikasi ulang oleh tim lapangan.',
  })
  responseNotes?: string | null;

  @ApiProperty({ example: '2025-01-15T08:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T08:00:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => ComplainSurveyDetailResponseDto })
  Survey?: ComplainSurveyDetailResponseDto | null;

  @ApiPropertyOptional({
    type: () => [SurveyComplainDocumentResponseDto],
  })
  SurveyComplainDocument?: SurveyComplainDocumentResponseDto[];
}

export class ComplainPaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class PaginatedComplainResponseDto {
  @ApiProperty({ type: () => [ComplainResponseDto] })
  data: ComplainResponseDto[];

  @ApiProperty({ type: () => ComplainPaginationMetaDto })
  meta: ComplainPaginationMetaDto;
}
