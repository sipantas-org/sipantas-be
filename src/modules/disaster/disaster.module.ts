import { Module } from '@nestjs/common';
import { DisasterService } from './disaster.service.js';
import { DisasterController } from './disaster.controller.js';
import { DisasterRepository } from './repositories/disaster.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DisasterController],
  providers: [DisasterService, DisasterRepository],
  exports: [DisasterService, DisasterRepository],
})
export class DisasterModule {}
