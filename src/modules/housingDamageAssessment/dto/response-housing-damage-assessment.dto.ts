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
  @Expose({ name: 'housingDamageAssessmentId' })
  id!: number;

  @ApiProperty({ example: 1 })
  @Expose({ name: 'housingAssessmentPartId' })
  idHousingAssessmentPart!: number;

  @ApiProperty({
    example: 'Pondasi/Sloof',
    nullable: true,
  })
  @Expose()
  @Transform(({ obj }) => obj?.housingAssessmentPart?.partName ?? null)
  housingAssessmentPartName!: string | null;

  @ApiProperty({
    example: 'Apakah dinding rumah mengalami keretakan struktural?',
  })
  @Expose({ name: 'surveyDamageQuestion' })
  surveyDamageQuestion!: string;

  @ApiProperty({ example: [{ total: 10, score: 7 }] })
  @Expose({ name: 'surveyScoring' })
  surveyScoring!: unknown;

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
