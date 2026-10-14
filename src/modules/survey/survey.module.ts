import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller.js';
import { SurveyService } from './survey.service.js';
import { SurveyRepository } from './repositories/survey.repository.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService, SurveyRepository, PrismaService],
  exports: [SurveyService],
})
export class SurveyModule {}
