import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class CreateDistrictDto {
  @DisplayName('District ID')
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  id: string;

  @DisplayName('Regency ID')
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  regencyId: string;

  @DisplayName('District Name')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
