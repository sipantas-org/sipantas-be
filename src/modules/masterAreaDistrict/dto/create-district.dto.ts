import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  regencyId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
