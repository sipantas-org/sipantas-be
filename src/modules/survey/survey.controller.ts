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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SurveyService } from './survey.service.js';
import { CreateSurveyDto } from './dto/create-survey.dto.js';
import { UpdateSurveyDto } from './dto/update-survey.dto.js';
import { UpdateSurveyStatusDto } from './dto/update-survey-status.dto.js';
import { QuerySurveyDto } from './dto/query-survey.dto.js';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { SurveyorGuard } from '../../common/guards/surveyor.guard.js';

@ApiBearerAuth('access-token')
@ApiTags('surveys')
@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, SurveyorGuard)
  @ApiOperation({
    summary: 'Buat survei baru',
    description:
      'Endpoint untuk membuat data survei baru beserta detail penilaian kerusakan fisik, furnitur, dan kerugian.',
  })
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.create(createSurveyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Daftar survei',
    description:
      'Mengambil daftar data survei secara terpaginasi dengan filter pencarian, status, bencana, dan pengurutan.',
  })
  findAll(@Query() query: QuerySurveyDto) {
    return this.surveyService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Detail survei',
    description:
      'Mengambil rincian data survei berdasarkan ID, termasuk relasi wilayah serta seluruh item penilaian detail.',
  })
  @ApiParam({ name: 'id', description: 'ID Survei', type: Number, example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.surveyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, SurveyorGuard)
  @ApiOperation({
    summary: 'Perbarui data survei',
    description:
      'Memperbarui data dan detail survei (kecuali surveyStatus) berdasarkan ID survei.',
  })
  @ApiParam({ name: 'id', description: 'ID Survei', type: Number, example: 1 })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSurveyDto: UpdateSurveyDto,
  ) {
    return this.surveyService.update(id, updateSurveyDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, SurveyorGuard)
  @ApiOperation({
    summary: 'Perbarui status survei',
    description:
      'Mengubah status survei dengan validasi alur proses (Pending, OnComplain, OnBudgeting, OnConstruction, Completed).',
  })
  @ApiParam({ name: 'id', description: 'ID Survei', type: Number, example: 1 })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSurveyStatusDto: UpdateSurveyStatusDto,
  ) {
    return this.surveyService.updateStatus(id, updateSurveyStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SurveyorGuard)
  @ApiOperation({
    summary: 'Hapus data survei',
    description:
      'Menghapus data survei beserta seluruh detailnya. Hanya survei dengan status Pending yang diizinkan untuk dihapus.',
  })
  @ApiParam({ name: 'id', description: 'ID Survei', type: Number, example: 1 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.surveyService.remove(id);
  }
}
