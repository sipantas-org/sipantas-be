import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatJakarta = ({ value }: { value: Date | null }) =>
  value ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null;

export class UserAdminResponseDto {
  @Expose({ name: 'ID_Admin' }) id!: number;
  @Expose({ name: 'NIP' }) nip!: string;
  @Expose({ name: 'Nama' }) nama!: string;
  @Expose({ name: 'Nomor_HP' }) nomorHp!: string;
  @Expose({ name: 'Email' }) email!: string;
  @Expose({ name: 'Status' }) status!: string;
  @Expose({ name: 'Role' }) role!: string;

  @Expose({ name: 'Last_Login' })
  @Transform(formatJakarta)
  lastLogin!: string | null;

  @Expose({ name: 'Created_At' })
  @Transform(formatJakarta)
  createdAt!: string;

  @Expose({ name: 'Updated_At' })
  @Transform(formatJakarta)
  updatedAt!: string;
}

export class UserSurveyorResponseDto {
  @Expose({ name: 'ID_Surveyor' }) id!: number;
  @Expose({ name: 'NIP' }) nip!: string;
  @Expose({ name: 'Nama' }) nama!: string;
  @Expose({ name: 'Nomor_HP' }) nomorHp!: string;
  @Expose({ name: 'Email' }) email!: string;
  @Expose({ name: 'Status' }) status!: string;
  @Expose({ name: 'ID_Province' }) idProvince!: string;
  @Expose({ name: 'ID_City' }) idCity!: string;

  @Expose({ name: 'Last_Login' })
  @Transform(formatJakarta)
  lastLogin!: string | null;

  @Expose({ name: 'Created_At' })
  @Transform(formatJakarta)
  createdAt!: string;

  @Expose({ name: 'Updated_At' })
  @Transform(formatJakarta)
  updatedAt!: string;
}

export class ApprovalUserResponseDto {
  @Expose({ name: 'ID_Approval' }) id!: number;
  @Expose({ name: 'ID_Surveyor' }) idSurveyor!: number;
  @Expose({ name: 'ID_Admin' }) idAdmin!: number;
  @Expose({ name: 'Status_Approval' }) statusApproval!: string;
  @Expose({ name: 'Description' }) description!: string | null;

  @Expose({ name: 'Approval_Date' })
  @Transform(formatJakarta)
  approvalDate!: string | null;

  @Expose({ name: 'Created_At' })
  @Transform(formatJakarta)
  createdAt!: string;

  @Expose({ name: 'Updated_At' })
  @Transform(formatJakarta)
  updatedAt!: string;
}
