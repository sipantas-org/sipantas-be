import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatJakarta = ({ value }: { value: Date | null }) =>
  value ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null;

export class HousingDamageAssessmentResponseDto {
  @Expose({ name: 'ID_Housing_Damage_Assessment' }) id!: number;
  @Expose({ name: 'ID_Housing_Assessment_Part' }) idHousingAssessmentPart!: number;
  @Expose({ name: 'Survey_Damage_Question' }) surveyDamageQuestion!: string;
  @Expose({ name: 'Survey_Scoring' }) surveyScoring!: unknown;
  @Expose({ name: 'Status' }) status!: string;

  @Expose({ name: 'Created_At' })
  @Transform(formatJakarta)
  createdAt!: string;

  @Expose({ name: 'Updated_At' })
  @Transform(formatJakarta)
  updatedAt!: string;
}
