import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateSurveyorProfileDto {
  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  @IsString()
  nomorHp?: string;

  @ApiPropertyOptional({ example: 'surveyor@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'newpassword123', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    example: 'oldpassword123',
    description: 'Wajib diisi jika ingin mengganti password',
  })
  @ValidateIf((dto) => !!dto.password)
  @IsNotEmpty({ message: 'currentPassword is required to change password' })
  @IsString()
  currentPassword?: string;

  @ApiPropertyOptional({ example: '32' })
  @IsOptional()
  @IsString()
  idProvince?: string;

  @ApiPropertyOptional({ example: '3273' })
  @IsOptional()
  @IsString()
  idCity?: string;
}
