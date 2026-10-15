import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdminProfileDto {
  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  @IsString()
  nomorHp?: string;

  @ApiPropertyOptional({ example: 'admin@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'newpassword123', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
