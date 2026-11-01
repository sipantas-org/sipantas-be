import { Module } from '@nestjs/common';
import { HousingAssessmentPartService } from './housing-assessment-part.service.js';
import { HousingAssessmentPartController } from './housing-assessment-part.controller.js';
import { HousingAssessmentPartRepository } from './repositories/housing-assessment-part.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { ActivityHistoryModule } from '../activityHistory/activity-history.module.js';

@Module({
  imports: [PrismaModule, ActivityHistoryModule],
  controllers: [HousingAssessmentPartController],
  providers: [HousingAssessmentPartService, HousingAssessmentPartRepository],
  exports: [HousingAssessmentPartService, HousingAssessmentPartRepository],
})
export class HousingAssessmentPartModule {}
