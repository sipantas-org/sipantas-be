import { Module } from '@nestjs/common';
import { DashboardSurveyorController } from './dashboard-surveyor.controller.js';
import { DashboardSurveyorService } from './dashboard-surveyor.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardSurveyorController],
  providers: [DashboardSurveyorService],
  exports: [DashboardSurveyorService],
})
export class DashboardSurveyorModule {}
