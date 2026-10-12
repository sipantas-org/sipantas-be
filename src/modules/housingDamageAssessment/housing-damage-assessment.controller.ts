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
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HousingDamageAssessmentService } from './housing-damage-assessment.service.js';
import { CreateHousingDamageAssessmentDto } from './dto/create-housing-damage-assessment.dto.js';
import { UpdateHousingDamageAssessmentDto } from './dto/update-housing-damage-assessment.dto.js';
import { HousingDamageAssessmentResponseDto } from './dto/response-housing-damage-assessment.dto.js';

@ApiTags('Housing Damage Assessments')
@Controller('housing-damage-assessments')
export class HousingDamageAssessmentController {
  constructor(
    private readonly housingDamageAssessmentService: HousingDamageAssessmentService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Buat data housing damage assessment baru' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: HousingDamageAssessmentResponseDto,
  })
  create(@Body() dto: CreateHousingDamageAssessmentDto) {
    return this.housingDamageAssessmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua data housing damage assessment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [HousingDamageAssessmentResponseDto],
  })
  findAll() {
    return this.housingDamageAssessmentService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Ambil satu data housing damage assessment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: HousingDamageAssessmentResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.housingDamageAssessmentService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Perbarui data housing damage assessment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: HousingDamageAssessmentResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHousingDamageAssessmentDto,
  ) {
    return this.housingDamageAssessmentService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Hapus data housing damage assessment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: HousingDamageAssessmentResponseDto,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.housingDamageAssessmentService.remove(id);
  }
}
