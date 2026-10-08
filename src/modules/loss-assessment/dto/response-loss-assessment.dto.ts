import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatJakarta = ({ value }: { value: Date | null }) =>
  value ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null;

export class LossAssessmentResponseDto {
  @Expose({ name: 'ID_Loss_Assessment' }) id!: number;
  @Expose({ name: 'Type_of_Loss' }) typeOfLoss!: string;
  @Expose({ name: 'Survey_Loss_Question' }) surveyLossQuestion!: string;
  @Expose({ name: 'Status' }) status!: string;

  @Expose({ name: 'Created_At' })
  @Transform(formatJakarta)
  createdAt!: string;

  @Expose({ name: 'Updated_At' })
  @Transform(formatJakarta)
  updatedAt!: string;
}
