import { Module } from '@nestjs/common';
import { ActivityHistoryService } from './activity-history.service.js';
import { ActivityHistoryRepository } from './repositories/activity-history.repository.js';

@Module({
  providers: [ActivityHistoryService, ActivityHistoryRepository],
  exports: [ActivityHistoryService],
})
export class ActivityHistoryModule {}
