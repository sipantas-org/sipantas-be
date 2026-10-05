import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { DisasterStatus } from '../../../generated/prisma/enums.js';

export class CreateDisasterDto {
  @IsString()
  @IsNotEmpty()
  disasterCode: string;

  @IsString()
  @IsNotEmpty()
  disasterName: string;

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  disasterCategory: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DisasterStatus)
  @IsNotEmpty()
  disasterStatus: DisasterStatus;

  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  provinceId: string;

  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  regencyId?: string;
}
