import { Transform } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { PartStatus } from '../../../generated/prisma/enums.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export class HousingAssessmentPartResponseDto {
  partId: number;
  partName: string;
  partStatus: PartStatus;

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
