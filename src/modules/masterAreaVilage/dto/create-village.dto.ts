import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class CreateVillageDto {
  @DisplayName('Village ID')
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  id: string;

  @DisplayName('District ID')
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  districtId: string;

  @DisplayName('Village Name')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
