import { Module } from '@nestjs/common';
import { MasterAreaVillageService } from './master-area-village.service.js';
import { MasterAreaVillageController } from './master-area-village.controller.js';
import { MasterAreaVillageRepository } from './repositories/master-area-village.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MasterAreaVillageController],
  providers: [MasterAreaVillageService, MasterAreaVillageRepository],
  exports: [MasterAreaVillageService, MasterAreaVillageRepository],
})
export class MasterAreaVillageModule {}
