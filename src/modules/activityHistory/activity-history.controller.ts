import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityHistoryService } from './activity-history.service.js';
import { RequestListActivityDto } from './dto/query-activity-history.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard.js';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator.js';
import { AdminRole } from '../../generated/prisma/enums.js';

@ApiTags('activity-history')
// @ApiBearerAuth('access-token')
// @UseGuards(JwtAuthGuard, AdminRoleGuard)
// @AdminRoles(AdminRole.Administrator, AdminRole.Monitoring)
@Controller('activity-history')
export class ActivityHistoryController {
  constructor(
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Daftar Riwayat Aktivitas',
    description:
      'Mengambil daftar riwayat aktivitas sistem dengan filter dan paginasi',
  })
  findAll(@Query() query: RequestListActivityDto) {
    return this.activityHistoryService.findAll(query);
  }
}
