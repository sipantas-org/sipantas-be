import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ComplainAction } from '../../../generated/prisma/enums.js';

export class UpdateSurveyComplainStatusDto {
  @ApiProperty({
    enum: ComplainAction,
    enumName: 'Action',
    example: ComplainAction.Resolved,
    description: 'Tindak lanjut Complain',
  })
  @IsEnum(ComplainAction)
  action: ComplainAction;

  @ApiProperty({
    description: 'Rincian keluhan/komplain atas data survei',
    example:
      'Tingkat kerusakan rumah seharusnya masuk kategori Berat bukan Sedang.',
  })
  @IsString()
  @IsOptional()
  description: string;
}
