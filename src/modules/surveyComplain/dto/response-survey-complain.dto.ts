import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Expose, Type } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import {
  Authority,
  ComplainAction,
  ComplainStatus,
  DamageLevel,
  SurveyStatus,
} from '../../../generated/prisma/enums.js';

dayjs.extend(utc);
dayjs.extend(timezone);

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

export class ComplainAreaDto {
  @ApiProperty({ example: '32' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Jawa Barat' })
  @Expose()
  name: string;
}

export class ComplainHousingDetailDto {
  @ApiProperty({ example: 1 })
  @Expose()
  housingDamageAssessmentId: number;

  @ApiProperty({ example: 3 })
  @Expose()
  totalUnit: number;

  @ApiProperty({ example: 15 })
  @Expose()
  score: number;
}

export class ComplainFileDetailDto {
  @ApiProperty({ example: 'Pondasi/Sloof' })
  @Expose()
  category: string;

  @ApiProperty({ example: 'complains/survey-12-170000/pondasi-sloof' })
  @Expose()
  filePath: string;

  @ApiProperty({ example: 'foto-1.jpg' })
  @Expose()
  fileName: string;
}

/** Response survei untuk POST /survey-complains/search-by-nik (tanpa surveyor/harga). */
export class ComplainSurveyLookupResponseDto {
  @ApiProperty({ example: 12 })
  @Expose()
  surveyId: number;

  @ApiProperty({ enum: SurveyStatus, example: SurveyStatus.Pending })
  @Expose()
  surveyStatus: SurveyStatus;

  @ApiProperty({ example: '3201123456780001' })
  @Expose()
  nik: string;

  @ApiProperty({ example: 'Rumah Pak Budi' })
  @Expose()
  assetName: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 10' })
  @Expose()
  addressDetail: string;

  @ApiProperty({ enum: Authority, example: Authority.KabupatenKota })
  @Expose()
  authority: Authority;

  @ApiProperty({ example: '-6.2088' })
  @Expose()
  latitude: string;

  @ApiProperty({ example: '106.8456' })
  @Expose()
  longitude: string;

  @ApiProperty({ enum: DamageLevel, example: DamageLevel.Sedang })
  @Expose()
  damageLevel: DamageLevel;

  @ApiProperty({ example: '150' })
  @Expose()
  volume: string;

  @ApiProperty({ example: 'm2' })
  @Expose()
  volumeUnit: string;

  @ApiProperty({ example: 3 })
  @Expose()
  disasterId: number;

  @ApiPropertyOptional({ example: '32', nullable: true })
  @Expose()
  provinceId: string | null;

  @ApiPropertyOptional({ example: '32.03', nullable: true })
  @Expose()
  regencyId: string | null;

  @ApiPropertyOptional({ example: '32.03.01', nullable: true })
  @Expose()
  districtId: string | null;

  @ApiPropertyOptional({ example: '32.03.01.1001', nullable: true })
  @Expose()
  villageId: string | null;

  @ApiPropertyOptional({ type: () => ComplainAreaDto, nullable: true })
  @Type(() => ComplainAreaDto)
  @Expose()
  province: ComplainAreaDto | null;

  @ApiPropertyOptional({ type: () => ComplainAreaDto, nullable: true })
  @Type(() => ComplainAreaDto)
  @Expose()
  regency: ComplainAreaDto | null;

  @ApiPropertyOptional({ type: () => ComplainAreaDto, nullable: true })
  @Type(() => ComplainAreaDto)
  @Expose()
  district: ComplainAreaDto | null;

  @ApiPropertyOptional({ type: () => ComplainAreaDto, nullable: true })
  @Type(() => ComplainAreaDto)
  @Expose()
  village: ComplainAreaDto | null;

  @ApiProperty({ type: () => [ComplainHousingDetailDto] })
  @Type(() => ComplainHousingDetailDto)
  @Expose()
  housingDetails: ComplainHousingDetailDto[];

  @ApiProperty({ type: () => [ComplainFileDetailDto] })
  @Type(() => ComplainFileDetailDto)
  @Expose()
  fileDetails: ComplainFileDetailDto[];

  @ApiProperty({ example: '2026-10-22 10:00:00' })
  @Expose()
  @Transform(({ value }) =>
    value
      ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      : null,
  )
  createdAt: string;
}
