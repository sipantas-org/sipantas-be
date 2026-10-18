import { Module } from '@nestjs/common';
import { ActivityHistoryService } from './activity-history.service.js';
import { ActivityHistoryRepository } from './repositories/activity-history.repository.js';
import { ActivityHistoryController } from './activity-history.controller.js';

@Module({
  controllers: [ActivityHistoryController],
  providers: [ActivityHistoryService, ActivityHistoryRepository],
  exports: [ActivityHistoryService],
})
export class ActivityHistoryModule {}
