import { IsEnum, IsOptional } from 'class-validator';
import { QueryDefaultDto } from '../../../dto/query-default.dto.js';
import { SectorStatus } from '../../../generated/prisma/enums.js';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QuerySectorDto extends QueryDefaultDto {
  @ApiPropertyOptional({
    enum: SectorStatus,
    example: SectorStatus.Active,
    description: '',
  })
  @IsOptional()
  @IsEnum(SectorStatus)
  status?: SectorStatus;
}
