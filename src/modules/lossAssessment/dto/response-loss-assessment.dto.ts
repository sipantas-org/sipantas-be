import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatJakarta = ({ value }: { value: Date | null }) =>
  value ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null;

export class LossAssessmentResponseDto {
  @ApiProperty({ example: 1 })
  @Expose({ name: 'lossAssessmentId' })
  id!: number;

  @ApiProperty({ example: 'additional_cost' })
  @Expose({ name: 'typeOfLoss' })
  typeOfLoss!: string;

  @ApiProperty({ example: 'Berapa estimasi kerugian material akibat bencana?' })
  @Expose({ name: 'surveyLossQuestion' })
  surveyLossQuestion!: string;

  @ApiProperty({ example: 'Active' })
  @Expose({ name: 'Status' })
  status!: string;

  @ApiProperty({ example: '2026-10-12 09:00:00' })
  @Expose({ name: 'createdAt' })
  @Transform(formatJakarta)
  createdAt!: string;

  @ApiProperty({ example: '2026-10-12 09:00:00' })
  @Expose({ name: 'updatedAt' })
  @Transform(formatJakarta)
  updatedAt!: string;
}
