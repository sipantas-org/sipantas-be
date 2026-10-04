import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { DisasterStatus } from '../../../generated/prisma/enums.js';

export class CreateDisasterDto {
  @IsString()
  @IsNotEmpty()
  Disaster_Code: string;

  @IsString()
  @IsNotEmpty()
  Disaster_Name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  Disaster_Category: string;

  @IsString()
  @IsOptional()
  Description?: string;

  @IsEnum(DisasterStatus)
  @IsNotEmpty()
  Status: DisasterStatus;
}
