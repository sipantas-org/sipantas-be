import { PartialType } from '@nestjs/mapped-types';
import { CreateProvinceDto } from './create-province.dto.js';

export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {}
