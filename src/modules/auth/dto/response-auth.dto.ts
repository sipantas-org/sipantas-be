import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatJakarta = ({ value }: { value: Date | null }) =>
  value ? dayjs(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null;

export class UserAdminResponseDto {
  @ApiProperty({ example: 1 })
  @Expose({ name: 'adminId' })
  id!: number;

  @ApiProperty({ example: '198801012015011002' })
  @Expose({ name: 'nip' })
  nip!: string;

  @ApiProperty({ example: 'Ahmad Administrator' })
  @Expose({ name: 'nama' })
  nama!: string;

  @ApiProperty({ example: '081298765432' })
  @Expose({ name: 'phoneNumber' })
  nomorHp!: string;

  @ApiProperty({ example: 'administrator.sipantas@gmail.com' })
  @Expose({ name: 'email' })
  email!: string;

  @ApiProperty({ example: 'Active' })
  @Expose({ name: 'status' })
  status!: string;

  @ApiProperty({ example: 'Administrator' })
  @Expose({ name: 'role' })
  role!: string;

  @ApiProperty({ type: String, example: '2026-10-17 09:00:00', nullable: true })
  @Expose({ name: 'lastLogin' })
  @Transform(formatJakarta)
  lastLogin!: string | null;

  @ApiProperty({ example: '2026-10-01 08:00:00' })
  @Expose({ name: 'createdAt' })
  @Transform(formatJakarta)
  createdAt!: string;

  @ApiProperty({ example: '2026-10-01 08:00:00' })
  @Expose({ name: 'updatedAt' })
  @Transform(formatJakarta)
  updatedAt!: string;
}

export class UserSurveyorResponseDto {
  @ApiProperty({ example: 1 })
  @Expose({ name: 'surveyorId' })
  id!: number;

  @ApiProperty({ example: '198501012010011001' })
  @Expose({ name: 'nip' })
  nip!: string;

  @ApiProperty({ example: 'Budi Santoso' })
  @Expose({ name: 'nama' })
  nama!: string;

  @ApiProperty({ example: '081234567890' })
  @Expose({ name: 'phoneNumber' })
  nomorHp!: string;

  @ApiProperty({ example: 'surveyor@example.com' })
  @Expose({ name: 'email' })
  email!: string;

  @ApiProperty({ example: 'Pending' })
  @Expose({ name: 'status' })
  status!: string;

  @ApiProperty({ example: '96' })
  @Expose({ name: 'provinceId' })
  idProvince!: string;

  @ApiProperty({ example: 'Papua' })
  @Expose()
  @Transform(({ obj }) => obj.province?.name ?? null)
  provinceName!: string | null;

  @ApiProperty({ example: '96.71' })
  @Expose({ name: 'regencyId' })
  idCity!: string;

  @ApiProperty({ example: 'Kabupaten Jayapura' })
  @Expose()
  @Transform(({ obj }) => obj.regency?.name ?? null)
  cityName!: string | null;

  @ApiProperty({ type: String, example: '2026-10-17 09:00:00', nullable: true })
  @Expose({ name: 'lastLogin' })
  @Transform(formatJakarta)
  lastLogin!: string | null;

  @ApiProperty({ example: '2026-10-01 08:00:00' })
  @Expose({ name: 'createdAt' })
  @Transform(formatJakarta)
  createdAt!: string;

  @ApiProperty({ example: '2026-10-01 08:00:00' })
  @Expose({ name: 'updatedAt' })
  @Transform(formatJakarta)
  updatedAt!: string;
}

export class LoginAdminResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token untuk admin',
  })
  accessToken!: string;

  @ApiProperty({ type: UserAdminResponseDto })
  user!: UserAdminResponseDto;
}

export class LoginSurveyorResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token untuk surveyor',
  })
  accessToken!: string;

  @ApiProperty({ type: UserSurveyorResponseDto })
  user!: UserSurveyorResponseDto;
}

export class ApprovalUserResponseDto {
  @ApiProperty({ example: 1 })
  @Expose({ name: 'approvalId' })
  id!: number;

  @ApiProperty({ example: 5 })
  @Expose({ name: 'surveyorId' })
  idSurveyor!: number;

  @ApiProperty({ example: 1 })
  @Expose({ name: 'adminId' })
  idAdmin!: number;

  @ApiProperty({ enum: ['Approved', 'Rejected'], example: 'Approved' })
  @Expose({ name: 'statusApproval' })
  statusApproval!: string;

  @ApiProperty({
    type: String,
    example: 'Dokumen identitas dan NIP telah valid dan sesuai.',
    nullable: true,
  })
  @Expose({ name: 'description' })
  description!: string | null;

  @ApiProperty({
    type: String,
    example: '2026-10-18 09:00:00',
    nullable: true,
  })
  @Expose({ name: 'approvalDate' })
  @Transform(formatJakarta)
  approvalDate!: string | null;

  @ApiProperty({ example: '2026-10-18 09:00:00' })
  @Expose({ name: 'createdAt' })
  @Transform(formatJakarta)
  createdAt!: string;

  @ApiProperty({ example: '2026-10-18 09:00:00' })
  @Expose({ name: 'updatedAt' })
  @Transform(formatJakarta)
  updatedAt!: string;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}

export class PaginatedAdminResponseDto {
  @ApiProperty({ type: [UserAdminResponseDto] })
  items!: UserAdminResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}

export class PaginatedSurveyorResponseDto {
  @ApiProperty({ type: [UserSurveyorResponseDto] })
  items!: UserSurveyorResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
