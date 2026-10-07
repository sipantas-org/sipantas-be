import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatJakarta = ({ value }: { value: Date | null }) =>
  value ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null;

export class UserAdminResponseDto {
  @Expose() ID_Admin!: number;
  @Expose() NIP!: string;
  @Expose() Nama!: string;
  @Expose() Nomor_HP!: string;
  @Expose() Email!: string;
  @Expose() Status!: string;
  @Expose() Role!: string;

  @Expose()
  @Transform(formatJakarta)
  Last_Login!: string | null;

  @Expose()
  @Transform(formatJakarta)
  Created_At!: string;

  @Expose()
  @Transform(formatJakarta)
  Updated_At!: string;
}

export class UserSurveyorResponseDto {
  @Expose() ID_Surveyor!: number;
  @Expose() NIP!: string;
  @Expose() Nama!: string;
  @Expose() Nomor_HP!: string;
  @Expose() Email!: string;
  @Expose() Status!: string;
  @Expose() ID_Province!: string;
  @Expose() ID_City!: string;

  @Expose()
  @Transform(formatJakarta)
  Last_Login!: string | null;

  @Expose()
  @Transform(formatJakarta)
  Created_At!: string;

  @Expose()
  @Transform(formatJakarta)
  Updated_At!: string;
}

export class ApprovalUserResponseDto {
  @Expose() ID_Approval!: number;
  @Expose() ID_Surveyor!: number;
  @Expose() ID_Admin!: number;
  @Expose() Status_Approval!: string;
  @Expose() Description!: string | null;

  @Expose()
  @Transform(formatJakarta)
  Approval_Date!: string | null;

  @Expose()
  @Transform(formatJakarta)
  Created_At!: string;

  @Expose()
  @Transform(formatJakarta)
  Updated_At!: string;
}
