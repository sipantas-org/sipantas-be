import { Module } from '@nestjs/common';
import { LossAssessmentService } from './loss-assessment.service.js';
import { LossAssessmentController } from './loss-assessment.controller.js';
import { LossAssessmentRepository } from './repositories/loss-assessment.repository.js';

@Module({
  controllers: [LossAssessmentController],
  providers: [LossAssessmentService, LossAssessmentRepository],
  exports: [LossAssessmentService],
})
export class LossAssessmentModule {}
