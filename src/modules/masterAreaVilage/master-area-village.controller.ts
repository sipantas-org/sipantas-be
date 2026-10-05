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
import { MasterAreaVillageService } from './master-area-village.service.js';
import { CreateVillageDto } from './dto/create-village.dto.js';
import { UpdateVillageDto } from './dto/update-village.dto.js';

@Controller('villages')
export class MasterAreaVillageController {
  constructor(private readonly villageService: MasterAreaVillageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateVillageDto) {
    return this.villageService.create(createDto);
  }

  @Get()
  findAll(@Query('districtId') districtId?: string) {
    return this.villageService.findAll(districtId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.villageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateVillageDto) {
    return this.villageService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.villageService.remove(id);
  }
}
