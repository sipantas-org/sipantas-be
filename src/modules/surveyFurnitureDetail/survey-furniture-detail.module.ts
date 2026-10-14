import { Module } from '@nestjs/common';
import { SurveyFurnitureDetailService } from './survey-furniture-detail.service.js';
import { SurveyFurnitureDetailRepository } from './repositories/survey-furniture-detail.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [SurveyFurnitureDetailService, SurveyFurnitureDetailRepository],
  exports: [SurveyFurnitureDetailService, SurveyFurnitureDetailRepository],
})
export class SurveyFurnitureDetailModule {}
