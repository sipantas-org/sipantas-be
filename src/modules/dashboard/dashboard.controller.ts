import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard.js';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@ApiBearerAuth('access-token')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('surveys/status-summary')
  @ApiOperation({
    summary: 'Statistik jumlah survei per status',
    description:
      'Mengembalikan jumlah survei yang dikelompokkan berdasarkan status proses.',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil ringkasan status',
  })
  getSurveyStatusSummary() {
    return this.dashboardService.getSurveyStatusSummary();
  }

  @Get('surveyors/approval-summary')
  @ApiOperation({
    summary: 'Statistik status persetujuan akun surveyor',
    description:
      'Mengembalikan total akun surveyor yang pending, approved/active, dan rejected.',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil ringkasan surveyor',
  })
  getSurveyorApprovalSummary() {
    return this.dashboardService.getSurveyorApprovalSummary();
  }

  @Get('disasters/summary')
  @ApiOperation({
    summary: 'Statistik jumlah bencana',
    description:
      'Mengembalikan total kejadian bencana beserta jumlah bencana aktif dan selesai.',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil ringkasan bencana',
  })
  getDisasterSummary() {
    return this.dashboardService.getDisasterSummary();
  }

  @Get('surveys/damage-distribution')
  @ApiOperation({
    summary: 'Distribusi tingkat kerusakan bangunan/aset',
    description:
      'Mengembalikan persentase dan jumlah survei per tingkat kerusakan.',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil distribusi kerusakan',
  })
  getDamageDistribution() {
    return this.dashboardService.getDamageDistribution();
  }

  @Get('trends/monthly')
  @ApiOperation({
    summary:
      'Tren bulanan total survei dan kerugian finansial (12 bulan terakhir)',
    description:
      'Mengembalikan akumulasi jumlah survei dan nilai kerugian bulanan selama 12 bulan ke belakang.',
  })
  @ApiQuery({
    name: 'months',
    required: false,
    type: Number,
    description: 'Jumlah bulan ke belakang (default: 12)',
  })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil tren bulanan' })
  getMonthlyTrends(@Query('months') months?: string) {
    const parsedMonths = months ? parseInt(months, 10) : 12;
    return this.dashboardService.getMonthlyTrends(parsedMonths);
  }

  @Get('disasters/survey-distribution')
  @ApiOperation({
    summary: 'Top N bencana dengan jumlah survei terbanyak',
    description:
      'Mengembalikan akumulasi survei pada kejadian bencana tertinggi.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Batas jumlah bencana yang ditampilkan (default: 5)',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil distribusi bencana',
  })
  getDisasterSurveyDistribution(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    return this.dashboardService.getDisasterSurveyDistribution(parsedLimit);
  }
}
