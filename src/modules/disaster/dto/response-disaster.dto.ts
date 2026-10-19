// disaster-response.dto.ts
import { Transform, Expose } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DisasterResponseDto {
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
  @Expose()
  provinceId: String;

  @Expose()
  @Transform(({ obj }) => obj.province?.name ?? null)
  provinceName!: string | null;
  @Expose()
  regencyId: String;

  @Expose()
  @Transform(({ obj }) => obj.regency?.name ?? null)
  regencyName!: string | null;

  @Expose()
  description: String;

  @Expose()
  @Transform(({ value }) =>
    value ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM') : null,
  )
  disasterDate: Date;

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
}
