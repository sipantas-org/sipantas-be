import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DisasterService } from './disaster.service.js';
import { CreateDisasterDto } from './dto/create-disaster.dto.js';
import { UpdateDisasterDto } from './dto/update-disaster.dto.js';

@Controller('disasters')
export class DisasterController {
  constructor(private readonly disasterService: DisasterService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDisasterDto: CreateDisasterDto) {
    return this.disasterService.create(createDisasterDto);
  }

  @Get()
  findAll() {
    return this.disasterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.disasterService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDisasterDto: UpdateDisasterDto,
  ) {
    return this.disasterService.update(id, updateDisasterDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.disasterService.remove(id);
  }
}
