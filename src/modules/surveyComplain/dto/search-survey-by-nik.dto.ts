import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class SearchSurveyByNikDto {
  @ApiProperty({
    description: 'NIK yang akan dicari data survei Pending terbarunya',
    example: '1102132211990001',
  })
  @DisplayName('NIK')
  @IsString({ message: 'NIK harus berupa teks' })
  @IsNumberString(
    { no_symbols: true },
    { message: 'NIK hanya boleh berisi angka' },
  )
  @Length(16, 16, { message: 'NIK harus terdiri dari 16 digit' })
  nik: string;
}
