// disaster-response.dto.ts
import { Transform } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DisasterResponseDto {
  id: number;
  Disaster_Code: string;
  Disaster_Name: string;
  Disaster_Category: string;
  Status: string;

  @Transform(({ value }) =>
    value
      ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      : null,
  )
  Created_At: Date;

  @Transform(({ value }) =>
    value
      ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      : null,
  )
  Updated_At: Date;
}
