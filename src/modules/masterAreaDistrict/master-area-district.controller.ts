import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MasterAreaDistrictService } from './master-area-district.service.js';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';

@Controller('districts')
export class MasterAreaDistrictController {
  constructor(private readonly districtService: MasterAreaDistrictService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateDistrictDto) {
    return this.districtService.create(createDto);
  }

  @Get()
  findAll(@Query('regencyId') regencyId?: string) {
    return this.districtService.findAll(regencyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDistrictDto) {
    return this.districtService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.districtService.remove(id);
  }
}
