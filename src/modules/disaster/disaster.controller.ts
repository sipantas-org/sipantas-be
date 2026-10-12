import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DisasterService } from './disaster.service.js';
import { CreateDisasterDto } from './dto/create-disaster.dto.js';
import { UpdateDisasterDto } from './dto/update-disaster.dto.js';
import { QueryDisasterDto } from './dto/query-disaster.dto.js';

@Controller('disasters')
export class DisasterController {
  constructor(private readonly disasterService: DisasterService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDisasterDto: CreateDisasterDto) {
    return this.disasterService.create(createDisasterDto);
  }

  @Get()
  findAll(@Query() query: QueryDisasterDto) {
    return this.disasterService.findAll(query);
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
