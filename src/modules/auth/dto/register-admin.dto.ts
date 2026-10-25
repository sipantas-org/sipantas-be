import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({
    example: '198801012015011002',
    description: 'Nomor Induk Pegawai (NIP) Admin',
  })
  @IsString()
  @IsNotEmpty()
  nip!: string;

  @ApiProperty({
    example: 'Ahmad Administrator',
    description: 'Nama lengkap admin',
  })
  @IsString()
  @IsNotEmpty()
  nama!: string;

  @ApiProperty({
    example: '081298765432',
    description: 'Nomor handphone admin',
  })
  @IsString()
  @IsNotEmpty()
  nomorHp!: string;

  @ApiProperty({
    example: 'admin.sipantas@example.com',
    description: 'Email aktif admin',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'AdminPass123!',
    minLength: 8,
    description: 'Kata sandi minimal 8 karakter',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
