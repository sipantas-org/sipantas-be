import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MasterAreaProvinceService } from './master-area-province.service.js';
import { CreateProvinceDto } from './dto/create-province.dto.js';
import { UpdateProvinceDto } from './dto/update-province.dto.js';

@Controller('provinces')
export class MasterAreaProvinceController {
  constructor(private readonly provinceService: MasterAreaProvinceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateProvinceDto) {
    return this.provinceService.create(createDto);
  }

  @Get()
  findAll() {
    return this.provinceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provinceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateProvinceDto) {
    return this.provinceService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.provinceService.remove(id);
  }
}
