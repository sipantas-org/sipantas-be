import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { DisasterModule } from './modules/disaster/disaster.module.js';
import { MasterAreaProvinceModule } from './modules/masterAreaProvince/master-area-province.module.js';
import { MasterAreaRegencyModule } from './modules/masterAreaRegency/master-area-regency.module.js';
import { MasterAreaDistrictModule } from './modules/masterAreaDistrict/master-area-district.module.js';
import { MasterAreaVillageModule } from './modules/masterAreaVilage/master-area-village.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DisasterModule,
    MasterAreaProvinceModule,
    MasterAreaRegencyModule,
    MasterAreaDistrictModule,
    MasterAreaVillageModule,
  ],
  controllers: [
    AppController, // <-- Pastikan AppController terdaftar di sini
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Terapkan middleware logger ke seluruh route
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
