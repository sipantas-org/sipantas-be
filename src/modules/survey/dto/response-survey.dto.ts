import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import {
  Authority,
  DamageLevel,
  SurveyStatus,
} from '../../../generated/prisma/enums.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export class SurveyAreaDto {
  @ApiProperty({ example: '32.01' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'KABUPATEN BOGOR' })
  @Expose()
  name: string;
}

export class SurveySurveyorDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @Expose()
  nama: string;

  @ApiProperty({ example: '198501012010011001' })
  @Expose()
  nip: string;

  @ApiProperty({ example: '08123456789' })
  @Expose()
  phoneNumber: string;
}

export class SurveyDisasterDto {
  @Expose()
  disasterId: String;
  @Expose()
  disasterCode: String;
  @Expose()
  disasterName: String;
  @Expose()
  disasterCategory: String;
  @Expose()
  disasterStatus: String;
}

export class SurveyResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  surveyId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  disasterId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  sectorId: number;

  @ApiProperty({ enum: SurveyStatus, example: SurveyStatus.Pending })
  @Expose()
  surveyStatus: SurveyStatus;

  @ApiPropertyOptional({ example: 1 })
  @Expose()
  surveyorId?: number;

  @ApiPropertyOptional({ example: '32' })
  @Expose()
  provinceId?: string;

  @ApiPropertyOptional({ example: '32.01' })
  @Expose()
  regencyId?: string;

  @ApiPropertyOptional({ example: '32.01.01' })
  @Expose()
  districtId?: string;

  @ApiPropertyOptional({ example: '32.01.01.2001' })
  @Expose()
  villageId?: string;

  @ApiProperty({ example: 'Jl. Raya Cipanas No. 12, RT 01 / RW 04' })
  @Expose()
  addressDetail: string;

  @ApiProperty({ enum: Authority, example: Authority.Pusat })
  @Expose()
  authority: Authority;

  @ApiProperty({ example: '1102132211990001' })
  @Expose()
  nik: string;

  @ApiProperty({ example: 'Rumah Pak Budi' })
  @Expose()
  assetName: string;

  @ApiProperty({ example: '-6.2088' })
  @Transform(({ value }) =>
    value !== null && value !== undefined ? value.toString() : '',
  )
  @Expose()
  latitude: string;

  @ApiProperty({ example: '106.8456' })
  @Transform(({ value }) =>
    value !== null && value !== undefined ? value.toString() : '',
  )
  @Expose()
  longitude: string;

  @ApiProperty({ enum: DamageLevel, example: DamageLevel.Sedang })
  @Expose()
  damageLevel: DamageLevel;

  @ApiProperty({ example: '150' })
  @Transform(({ value }) =>
    value !== null && value !== undefined ? value.toString() : '',
  )
  @Expose()
  volume: string;

  @ApiProperty({ example: 'm2' })
  @Expose()
  volumeUnit: string;

  @ApiPropertyOptional({ example: '55.00', nullable: true })
  @Expose()
  @Transform(({ value }) => (value == null ? null : value.toString()))
  totalScore?: string | null;

  @ApiPropertyOptional({ example: '55.00', nullable: true })
  @Expose()
  @Transform(({ value }) => (value == null ? null : value.toString()))
  totalPriceUnit?: string | null;

  @ApiPropertyOptional({ example: '55.00', nullable: true })
  @Expose()
  @Transform(({ value }) => (value == null ? null : value.toString()))
  totalPriceFurniture?: string | null;

  @ApiPropertyOptional({ example: 'APBN' })
  @Expose()
  sourceOfBudgetting?: string;

  @ApiPropertyOptional({ type: () => SurveyAreaDto })
  @Type(() => SurveyAreaDto)
  @Expose()
  province?: SurveyAreaDto;

  @ApiPropertyOptional({ type: () => SurveyAreaDto })
  @Type(() => SurveyAreaDto)
  @Expose()
  regency?: SurveyAreaDto;

  @ApiPropertyOptional({ type: () => SurveyAreaDto })
  @Type(() => SurveyAreaDto)
  @Expose()
  district?: SurveyAreaDto;

  @ApiPropertyOptional({ type: () => SurveyAreaDto })
  @Type(() => SurveyAreaDto)
  @Expose()
  village?: SurveyAreaDto;

  @ApiPropertyOptional({ type: () => SurveySurveyorDto })
  @Type(() => SurveySurveyorDto)
  @Expose()
  surveyor?: SurveySurveyorDto;

  @ApiPropertyOptional({ type: () => SurveyDisasterDto })
  @Type(() => SurveyDisasterDto)
  @Expose()
  disaster?: SurveyDisasterDto;

  @ApiProperty({ example: '2025-01-01 10:00:00' })
  @Transform(({ value }) =>
    value
      ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      : null,
  )
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2025-01-01 10:00:00' })
  @Transform(({ value }) =>
    value
      ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      : null,
  )
  @Expose()
  updatedAt: string;
}
