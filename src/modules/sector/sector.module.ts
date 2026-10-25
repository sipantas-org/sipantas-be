import { Module } from '@nestjs/common';
import { SectorService } from './sector.service.js';
import { SectorController } from './sector.controller.js';
import { SectorRepository } from './repositories/sector.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SectorController],
  providers: [SectorService, SectorRepository],
  exports: [SectorService, SectorRepository],
})
export class SectorModule {}
