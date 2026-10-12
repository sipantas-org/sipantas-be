import { Transform, Type } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { SectorStatus } from '../../../generated/prisma/enums.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export class SectorResponseDto {
  sectorId: number;
  sectorName: string;
  parentId: number | null;
  description: string | null;
  status: SectorStatus;

  @Type(() => SectorResponseDto)
  children?: SectorResponseDto[];

  @Transform(({ value }) =>
    value
      ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      : null,
  )
  createdAt: Date;

  @Transform(({ value }) =>
    value
      ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      : null,
  )
  updatedAt: Date;
}
