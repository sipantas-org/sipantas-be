import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserAdminRepository } from './repositories/user-admin.repository.js';
import { UserSurveyorRepository } from './repositories/user-surveyor.repository.js';
import { LoginHistoryRepository } from './repositories/login-history.repository.js';
import { ApprovalUserRepository } from './repositories/approval-user.repository.js';
import { JwtAuthModule } from '../../common/auth/jwt-auth.module.js';
import { ActivityHistoryModule } from '../activityHistory/activity-history.module.js';

@Module({
  imports: [forwardRef(() => JwtAuthModule), ActivityHistoryModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserAdminRepository,
    UserSurveyorRepository,
    LoginHistoryRepository,
    ApprovalUserRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
