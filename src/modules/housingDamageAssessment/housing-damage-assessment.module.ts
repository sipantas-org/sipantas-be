import { Module } from '@nestjs/common';
import { HousingDamageAssessmentService } from './housing-damage-assessment.service.js';
import { HousingDamageAssessmentController } from './housing-damage-assessment.controller.js';
import { HousingDamageAssessmentRepository } from './repositories/housing-damage-assessment.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [HousingDamageAssessmentController],
  providers: [
    HousingDamageAssessmentService,
    HousingDamageAssessmentRepository,
  ],
  exports: [HousingDamageAssessmentService, HousingDamageAssessmentRepository],
})
export class HousingDamageAssessmentModule {}
