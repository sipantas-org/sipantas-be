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
import { HousingDamageAssessmentService } from './housing-damage-assessment.service.js';
import { CreateHousingDamageAssessmentDto } from './dto/create-housing-damage-assessment.dto.js';
import { UpdateHousingDamageAssessmentDto } from './dto/update-housing-damage-assessment.dto.js';

@Controller('housing-damage-assessments')
export class HousingDamageAssessmentController {
  constructor(
    private readonly housingDamageAssessmentService: HousingDamageAssessmentService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateHousingDamageAssessmentDto) {
    return this.housingDamageAssessmentService.create(dto);
  }

  @Get()
  findAll() {
    return this.housingDamageAssessmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.housingDamageAssessmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHousingDamageAssessmentDto,
  ) {
    return this.housingDamageAssessmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.housingDamageAssessmentService.remove(id);
  }
}
