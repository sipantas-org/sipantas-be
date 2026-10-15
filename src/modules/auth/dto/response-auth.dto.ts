import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatJakarta = ({ value }: { value: Date | null }) =>
  value ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null;

export class UserAdminResponseDto {
  @Expose({ name: 'adminId' }) id!: number;
  @Expose({ name: 'nip' }) nip!: string;
  @Expose({ name: 'nama' }) nama!: string;
  @Expose({ name: 'phoneNumber' }) nomorHp!: string;
  @Expose({ name: 'email' }) email!: string;
  @Expose({ name: 'status' }) status!: string;
  @Expose({ name: 'role' }) role!: string;

  @Expose({ name: 'lastLogin' })
  @Transform(formatJakarta)
  lastLogin!: string | null;

  @Expose({ name: 'createdAt' })
  @Transform(formatJakarta)
  createdAt!: string;

  @Expose({ name: 'updatedAt' })
  @Transform(formatJakarta)
  updatedAt!: string;
}

export class UserSurveyorResponseDto {
  @Expose({ name: 'surveyorId' }) id!: number;
  @Expose({ name: 'nip' }) nip!: string;
  @Expose({ name: 'nama' }) nama!: string;
  @Expose({ name: 'phoneNumber' }) nomorHp!: string;
  @Expose({ name: 'email' }) email!: string;
  @Expose({ name: 'status' }) status!: string;
  @Expose({ name: 'provinceId' }) idProvince!: string;
  @Expose({ name: 'regencyId' }) idCity!: string;

  @Expose({ name: 'lastLogin' })
  @Transform(formatJakarta)
  lastLogin!: string | null;

  @Expose({ name: 'createdAt' })
  @Transform(formatJakarta)
  createdAt!: string;

  @Expose({ name: 'updatedAt' })
  @Transform(formatJakarta)
  updatedAt!: string;
}

export class ApprovalUserResponseDto {
  @Expose({ name: 'approvalId' }) id!: number;
  @Expose({ name: 'surveyorId' }) idSurveyor!: number;
  @Expose({ name: 'adminId' }) idAdmin!: number;
  @Expose({ name: 'statusApproval' }) statusApproval!: string;
  @Expose({ name: 'Description' }) description!: string | null;

  @Expose({ name: 'approvalDate' })
  @Transform(formatJakarta)
  approvalDate!: string | null;

  @Expose({ name: 'createdAt' })
  @Transform(formatJakarta)
  createdAt!: string;

  @Expose({ name: 'updatedAt' })
  @Transform(formatJakarta)
  updatedAt!: string;
}
