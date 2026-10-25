import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterSurveyorDto {
  @ApiProperty({
    example: '198501012010011001',
    description: 'Nomor Induk Pegawai (NIP)',
  })
  @IsString()
  @IsNotEmpty()
  nip!: string;

  @ApiProperty({
    example: 'Budi Santoso',
    description: 'Nama lengkap surveyor',
  })
  @IsString()
  @IsNotEmpty()
  nama!: string;

  @ApiProperty({
    example: '081234567890',
    description: 'Nomor handphone surveyor',
  })
  @IsString()
  @IsNotEmpty()
  nomorHp!: string;

  @ApiProperty({
    example: 'surveyor@example.com',
    description: 'Email aktif surveyor',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    minLength: 8,
    description: 'Kata sandi minimal 8 karakter',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    example: '96',
    description: 'ID/Kode BPS Provinsi penugasan',
  })
  @IsString()
  @IsNotEmpty()
  idProvince!: string;

  @ApiProperty({
    example: '96.71',
    description: 'ID/Kode BPS Kabupaten/Kota penugasan',
  })
  @IsString()
  @IsNotEmpty()
  idCity!: string;
}
