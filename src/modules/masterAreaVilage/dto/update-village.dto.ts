import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class UpdateVillageDto {
  @ApiPropertyOptional({ example: 'Alue Bagok' })
  @DisplayName('Village Name')
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;
}
