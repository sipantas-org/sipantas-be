import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Expose } from 'class-transformer';
import dayjs from 'dayjs';
import {
  ComplainAction,
  ComplainStatus,
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

export class ComplainResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  complainId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  surveyId: number;

  @ApiPropertyOptional({ example: 'Budi Santoso' })
  @Expose()
  complainantName?: string | null;

  @ApiPropertyOptional({ example: '3201123456780001' })
  @Expose()
  complainantNik?: string | null;

  @ApiPropertyOptional({ example: '081234567890' })
  @Expose()
  complainantPhone?: string | null;

  @ApiProperty({
    example:
      'Tingkat kerusakan rumah seharusnya masuk kategori Berat bukan Sedang.',
  })
  @Expose()
  description: string;

  @ApiProperty({ enum: ComplainStatus, example: ComplainStatus.Pending })
  @Expose()
  status: ComplainStatus;

  @ApiPropertyOptional({
    enum: ComplainAction,
    example: ComplainAction.Resolved,
  })
  @Expose()
  action?: ComplainAction | null;

  @ApiPropertyOptional({
    example:
      'Akan dilakukan investigasi dan verifikasi ulang oleh tim lapangan.',
  })
  @Expose()
  responseNotes?: string | null;

  @Expose()
  @Transform(({ value }) =>
    value
      ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      : null,
  )
  createdAt: Date;

  @Expose()
  @Transform(({ value }) =>
    value
      ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      : null,
  )
  updatedAt: Date;

  @ApiPropertyOptional({
    type: () => [SurveyComplainDocumentResponseDto],
  })
  @Expose()
  SurveyComplainDocument?: SurveyComplainDocumentResponseDto[];
}
