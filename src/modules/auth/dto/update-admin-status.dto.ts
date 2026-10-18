import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AdminStatus } from '../../../generated/prisma/enums.js';

export class UpdateAdminStatusDto {
  @ApiProperty({ enum: AdminStatus, example: AdminStatus.Inactive })
  @IsEnum(AdminStatus)
  status: AdminStatus;
}
