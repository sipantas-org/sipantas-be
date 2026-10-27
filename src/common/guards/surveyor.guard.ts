import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';

@Injectable()
export class SurveyorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    if (!request.user || request.user.userType !== 'surveyor') {
      throw new ForbiddenException('Access denied. Surveyor role required.');
    }
    return true;
  }
}
