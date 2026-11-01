import { Module } from '@nestjs/common';
import { ComplainController } from './complain.controller.js';
import { ComplainService } from './complain.service.js';
import { ComplainRepository } from './repositories/complain.repository.js';
import { ActivityHistoryModule } from '../activityHistory/activity-history.module.js';

@Module({
  imports: [ActivityHistoryModule],
  controllers: [ComplainController],
  providers: [ComplainService, ComplainRepository],
  exports: [ComplainService, ComplainRepository],
})
export class ComplainModule {}
