import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class ApproveSurveyorDto {
  @ApiProperty({
    enum: ['Approved', 'Rejected'],
    example: 'Approved',
    description: 'Keputusan persetujuan surveyor (Approved atau Rejected)',
  })
  @IsIn(['Approved', 'Rejected'])
  status!: 'Approved' | 'Rejected';

  @ApiPropertyOptional({
    example: 'Dokumen identitas dan NIP telah valid dan sesuai.',
    description: 'Catatan atau alasan persetujuan maupun penolakan',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
