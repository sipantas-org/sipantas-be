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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HousingDamageAssessmentService } from './housing-damage-assessment.service.js';
import { CreateHousingDamageAssessmentDto } from './dto/create-housing-damage-assessment.dto.js';
import { UpdateHousingDamageAssessmentDto } from './dto/update-housing-damage-assessment.dto.js';
import { HousingDamageAssessmentResponseDto } from './dto/response-housing-damage-assessment.dto.js';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard.js';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator.js';
import { AdminRole } from '../../generated/prisma/enums.js';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Housing Damage Assessments')
@Controller('housing-damage-assessments')
export class HousingDamageAssessmentController {
  constructor(
    private readonly housingDamageAssessmentService: HousingDamageAssessmentService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
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
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
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
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
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
