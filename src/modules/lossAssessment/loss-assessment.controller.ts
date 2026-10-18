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
import { LossAssessmentService } from './loss-assessment.service.js';
import { CreateLossAssessmentDto } from './dto/create-loss-assessment.dto.js';
import { UpdateLossAssessmentDto } from './dto/update-loss-assessment.dto.js';
import { LossAssessmentResponseDto } from './dto/response-loss-assessment.dto.js';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard.js';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator.js';
import { AdminRole } from '../../generated/prisma/enums.js';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Loss Assessments')
@Controller('loss-assessments')
export class LossAssessmentController {
  constructor(private readonly lossAssessmentService: LossAssessmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Buat data loss assessment baru' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: LossAssessmentResponseDto,
  })
  create(@Body() dto: CreateLossAssessmentDto) {
    return this.lossAssessmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua data loss assessment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [LossAssessmentResponseDto],
  })
  findAll() {
    return this.lossAssessmentService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Ambil satu data loss assessment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LossAssessmentResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lossAssessmentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Perbarui data loss assessment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LossAssessmentResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLossAssessmentDto,
  ) {
    return this.lossAssessmentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Hapus data loss assessment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LossAssessmentResponseDto,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lossAssessmentService.remove(id);
  }
}
