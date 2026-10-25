import { Module } from '@nestjs/common';
import { SurveyHousingDetailService } from './survey-housing-detail.service.js';
import { SurveyHousingDetailRepository } from './repositories/survey-housing-detail.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [SurveyHousingDetailService, SurveyHousingDetailRepository],
  exports: [SurveyHousingDetailService, SurveyHousingDetailRepository],
})
export class SurveyHousingDetailModule {}
