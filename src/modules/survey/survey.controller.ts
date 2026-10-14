import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SurveyService } from './survey.service.js';
import { CreateSurveyDto } from './dto/create-survey.dto.js';
import { UpdateSurveyDto } from './dto/update-survey.dto.js';
import { SurveyStatus } from '../../generated/prisma/enums.js';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.create(createSurveyDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: SurveyStatus,
    @Query('disasterId') disasterId?: number,
  ) {
    return this.surveyService.findAll({ page, limit, status, disasterId });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.surveyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSurveyDto: UpdateSurveyDto,
  ) {
    return this.surveyService.update(id, updateSurveyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.surveyService.remove(id);
  }
}
