import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { LossAssessmentService } from './loss-assessment.service.js';
import { CreateLossAssessmentDto } from './dto/create-loss-assessment.dto.js';
import { UpdateLossAssessmentDto } from './dto/update-loss-assessment.dto.js';

@Controller('loss-assessments')
export class LossAssessmentController {
  constructor(private readonly lossAssessmentService: LossAssessmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateLossAssessmentDto) {
    return this.lossAssessmentService.create(dto);
  }

  @Get()
  findAll() {
    return this.lossAssessmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lossAssessmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLossAssessmentDto,
  ) {
    return this.lossAssessmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lossAssessmentService.remove(id);
  }
}
