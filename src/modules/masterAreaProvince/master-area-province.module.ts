import { Module } from '@nestjs/common';
import { MasterAreaProvinceService } from './master-area-province.service.js';
import { MasterAreaProvinceController } from './master-area-province.controller.js';
import { MasterAreaProvinceRepository } from './repositories/master-area-province.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MasterAreaProvinceController],
  providers: [MasterAreaProvinceService, MasterAreaProvinceRepository],
  exports: [MasterAreaProvinceService],
})
export class MasterAreaProvinceModule {}
