import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatJakarta = ({ value }: { value: Date | null }) =>
  value ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null;

export class HousingDamageAssessmentResponseDto {
  @ApiProperty({ example: 1 })
  @Expose({ name: 'ID_Housing_Damage_Assessment' })
  id!: number;

  @ApiProperty({ example: 1 })
  @Expose({ name: 'ID_Housing_Assessment_Part' })
  idHousingAssessmentPart!: number;

  @ApiProperty({ example: 'Apakah dinding rumah mengalami keretakan struktural?' })
  @Expose({ name: 'Survey_Damage_Question' })
  surveyDamageQuestion!: string;

  @ApiProperty({ example: [{ total: 10, score: 7 }] })
  @Expose({ name: 'Survey_Scoring' })
  surveyScoring!: unknown;

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
