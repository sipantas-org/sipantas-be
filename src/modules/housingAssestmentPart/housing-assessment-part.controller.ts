import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { HousingAssessmentPartService } from './housing-assessment-part.service.js';
import { CreateHousingAssessmentPartDto } from './dto/create-housing-assessment-part.dto.js';
import { UpdateHousingAssessmentPartDto } from './dto/update-housing-assessment-part.dto.js';
import { QueryHousingAssessmentPartDto } from './dto/query-housing-assessment-part.dto.js';

@Controller('housing-assessment-part')
export class HousingAssessmentPartController {
  constructor(
    private readonly housingAssessmentPartService: HousingAssessmentPartService,
  ) {}

  @Post()
  create(@Body() createDto: CreateHousingAssessmentPartDto) {
    return this.housingAssessmentPartService.create(createDto);
  }

  @Get()
  findAll(@Query() query: QueryHousingAssessmentPartDto) {
    return this.housingAssessmentPartService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.housingAssessmentPartService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateHousingAssessmentPartDto,
  ) {
    return this.housingAssessmentPartService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.housingAssessmentPartService.remove(id);
  }
}
