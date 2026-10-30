import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { DashboardSurveyorService } from './dashboard-surveyor.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { SurveyorGuard } from '../../common/guards/surveyor.guard.js';

@ApiTags('dashboard-surveyor')
@Controller('dashboard-surveyor')
@UseGuards(JwtAuthGuard, SurveyorGuard)
@ApiBearerAuth('access-token')
export class DashboardSurveyorController {
  constructor(
    private readonly dashboardSurveyorService: DashboardSurveyorService,
  ) {}

  private extractSurveyorId(req: Request): number {
    const user = (req as any).user;
    const rawId = user?.surveyorId ?? user?.id ?? user?.userId ?? user?.sub;
    const surveyorId = Number(rawId);

    if (!rawId || Number.isNaN(surveyorId)) {
      throw new UnauthorizedException(
        'Identitas surveyor tidak valid atau tidak ditemukan dalam token otentikasi.',
      );
    }

    return surveyorId;
  }

  @Get('surveys/damage-distribution')
  @ApiOperation({
    summary: 'Distribusi tingkat kerusakan bangunan survei milik surveyor',
    description:
      'Mengembalikan persentase dan jumlah survei per tingkat kerusakan untuk surveyor yang sedang login.',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil distribusi kerusakan',
  })
  getDamageDistribution(@Req() req: Request) {
    const surveyorId = this.extractSurveyorId(req);
    return this.dashboardSurveyorService.getDamageDistribution(surveyorId);
  }

  @Get('surveys/status-summary')
  @ApiOperation({
    summary: 'Statistik jumlah survei per status milik surveyor',
    description:
      'Mengembalikan jumlah survei yang dikelompokkan berdasarkan status proses untuk surveyor yang sedang login.',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil ringkasan status survei',
  })
  getSurveyStatusSummary(@Req() req: Request) {
    const surveyorId = this.extractSurveyorId(req);
    return this.dashboardSurveyorService.getSurveyStatusSummary(surveyorId);
  }
}
