import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class CreateProvinceDto {
  @DisplayName('Province ID')
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  id: string;

  @DisplayName('Province Name')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
