import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterSurveyorDto {
  @IsString()
  @IsNotEmpty()
  NIP!: string;

  @IsString()
  @IsNotEmpty()
  Nama!: string;

  @IsString()
  @IsNotEmpty()
  Nomor_HP!: string;

  @IsEmail()
  Email!: string;

  @IsString()
  @MinLength(8)
  Password!: string;

  @IsString()
  @IsNotEmpty()
  ID_Province!: string;

  @IsString()
  @IsNotEmpty()
  ID_City!: string;
}
