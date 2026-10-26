import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateSurveyComplainDto {
  @ApiPropertyOptional({
    description: 'Description',
    example: 'Data tidak sesuai',
  })
  @IsOptional()
  @IsString()
  complainDescription: string;

  @ApiPropertyOptional({
    description: 'File path images',
    example: ['img/1.jpg', 'img/2.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagesPath?: string[];
}
