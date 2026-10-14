import { Module } from '@nestjs/common';
import { SurveyHousingDetailService } from './survey-housing-detail.service.js';
import { SurveyHousingDetailController } from './survey-housing-detail.controller.js';
import { SurveyHousingDetailRepository } from './repositories/survey-housing-detail.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SurveyHousingDetailController],
  providers: [SurveyHousingDetailService, SurveyHousingDetailRepository],
  exports: [SurveyHousingDetailService, SurveyHousingDetailRepository],
})
export class SurveyHousingDetailModule {}
