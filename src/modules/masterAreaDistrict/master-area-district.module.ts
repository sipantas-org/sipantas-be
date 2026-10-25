import { Module } from '@nestjs/common';
import { MasterAreaDistrictService } from './master-area-district.service.js';
import { MasterAreaDistrictController } from './master-area-district.controller.js';
import { MasterAreaDistrictRepository } from './repositories/master-area-district.repository.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MasterAreaDistrictController],
  providers: [MasterAreaDistrictService, MasterAreaDistrictRepository],
  exports: [MasterAreaDistrictService, MasterAreaDistrictRepository],
})
export class MasterAreaDistrictModule {}
