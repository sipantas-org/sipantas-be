import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateVillageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  districtId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
