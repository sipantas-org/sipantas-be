import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRegencyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  provinceId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
