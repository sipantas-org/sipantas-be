import { Module } from '@nestjs/common';
import { ComplainController } from './complain.controller.js';
import { ComplainService } from './complain.service.js';
import { ComplainRepository } from './repositories/complain.repository.js';

@Module({
  controllers: [ComplainController],
  providers: [ComplainService, ComplainRepository],
  exports: [ComplainService, ComplainRepository],
})
export class ComplainModule {}
