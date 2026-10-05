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
import { MasterAreaRegencyService } from './master-area-regency.service.js';
import { CreateRegencyDto } from './dto/create-regency.dto.js';
import { UpdateRegencyDto } from './dto/update-regency.dto.js';

@Controller('regencies')
export class MasterAreaRegencyController {
  constructor(private readonly regencyService: MasterAreaRegencyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateRegencyDto) {
    return this.regencyService.create(createDto);
  }

  @Get()
  findAll(@Query('provinceId') provinceId?: string) {
    return this.regencyService.findAll(provinceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regencyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateRegencyDto) {
    return this.regencyService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.regencyService.remove(id);
  }
}
