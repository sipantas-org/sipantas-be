import { Module } from '@nestjs/common';
import { SurveyLostDetailService } from './survey-lost-detail.service.js';
import { SurveyLostDetailRepository } from './repositories/survey-lost-detail.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [SurveyLostDetailService, SurveyLostDetailRepository],
  exports: [SurveyLostDetailService, SurveyLostDetailRepository],
})
export class SurveyLostDetailModule {}
