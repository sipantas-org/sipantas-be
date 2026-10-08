import { IsEmail, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'Email@email.com',
    description: 'Email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'xxxxxx',
    description: 'Password',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
