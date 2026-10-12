import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @IsString()
  @IsNotEmpty()
  nip!: string;

  @IsString()
  @IsNotEmpty()
  nama!: string;

  @IsString()
  @IsNotEmpty()
  nomorHp!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
