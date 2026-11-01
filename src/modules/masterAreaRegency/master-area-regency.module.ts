import { Module } from '@nestjs/common';
import { MasterAreaRegencyService } from './master-area-regency.service.js';
import { MasterAreaRegencyController } from './master-area-regency.controller.js';
import { MasterAreaRegencyRepository } from './repositories/master-area-regency.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { ActivityHistoryModule } from '../activityHistory/activity-history.module.js';

@Module({
  imports: [PrismaModule, ActivityHistoryModule],
  controllers: [MasterAreaRegencyController],
  providers: [MasterAreaRegencyService, MasterAreaRegencyRepository],
  exports: [MasterAreaRegencyService, MasterAreaRegencyRepository],
})
export class MasterAreaRegencyModule {}
