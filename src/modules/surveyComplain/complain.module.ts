import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ComplainController } from './complain.controller.js';
import { ComplainService } from './complain.service.js';
import { ComplainRepository } from './repositories/complain.repository.js';

@Module({
  imports: [
    // Rate limit khusus modul ini (dipakai oleh endpoint pencarian NIK publik)
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 5 }]),
  ],
  controllers: [ComplainController],
  providers: [ComplainService, ComplainRepository],
  exports: [ComplainService, ComplainRepository],
})
export class ComplainModule {}
