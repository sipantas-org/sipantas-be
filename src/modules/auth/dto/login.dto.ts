import { IsEmail, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'administrator.sipantas@gmail.com',
    description: 'Email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password.sipantas123',
    description: 'Password',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
