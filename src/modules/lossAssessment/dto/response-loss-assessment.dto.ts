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
  @Expose({ name: 'ID_Loss_Assessment' })
  id!: number;

  @ApiProperty({ example: 'additional_cost' })
  @Expose({ name: 'Type_of_Loss' })
  typeOfLoss!: string;

  @ApiProperty({ example: 'Berapa estimasi kerugian material akibat bencana?' })
  @Expose({ name: 'Survey_Loss_Question' })
  surveyLossQuestion!: string;

  @ApiProperty({ example: 'Active' })
  @Expose({ name: 'Status' })
  status!: string;

  @ApiProperty({ example: '2026-10-12 09:00:00' })
  @Expose({ name: 'Created_At' })
  @Transform(formatJakarta)
  createdAt!: string;

  @ApiProperty({ example: '2026-10-12 09:00:00' })
  @Expose({ name: 'Updated_At' })
  @Transform(formatJakarta)
  updatedAt!: string;
}
