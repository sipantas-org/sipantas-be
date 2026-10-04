import { PartialType } from '@nestjs/mapped-types';
import { CreateDisasterDto } from './create-disaster.dto.js';

export class UpdateDisasterDto extends PartialType(CreateDisasterDto) {}
