import { Module } from '@nestjs/common';
import { HousingDamageAssessmentService } from './housing-damage-assessment.service.js';
import { HousingDamageAssessmentController } from './housing-damage-assessment.controller.js';
import { HousingDamageAssessmentRepository } from './repositories/housing-damage-assessment.repository.js';

@Module({
  controllers: [HousingDamageAssessmentController],
  providers: [HousingDamageAssessmentService, HousingDamageAssessmentRepository],
  exports: [HousingDamageAssessmentService],
})
export class HousingDamageAssessmentModule {}
