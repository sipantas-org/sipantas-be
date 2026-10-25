import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class UpdateRegencyDto {
  @ApiPropertyOptional({ example: 'Kabupaten Aceh Barat' })
  @DisplayName('Regency Name')
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;
}
