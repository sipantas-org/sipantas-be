import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PartStatus } from '../../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class CreateHousingAssessmentPartDto {
  @ApiProperty({
    example: 'Dinding',
    description: '',
  })
  @DisplayName('Part Name')
  @IsString()
  @IsNotEmpty()
  partName: string;

  @ApiProperty({
    example: 'Active',
    description: '',
  })
  @DisplayName('Part Status')
  @IsEnum(PartStatus)
  @IsNotEmpty()
  partStatus: PartStatus;
}
