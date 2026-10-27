// src/common/guards/combined-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BasicAuthGuard } from './basic-auth.guard.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
@Injectable()
export class CombinedAuthGuard implements CanActivate {
  private readonly basicAuthGuard = new BasicAuthGuard();
  private readonly jwtAuthGuard = new JwtAuthGuard();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Header Authorization wajib diisi');
    }

    // 1. Jika header diawali 'Basic ', validasi via BasicAuthGuard
    if (authHeader.startsWith('Basic ')) {
      return this.basicAuthGuard.canActivate(context);
    }

    // 2. Jika header diawali 'Bearer ', validasi via JwtAuthGuard
    if (authHeader.startsWith('Bearer ')) {
      return (await this.jwtAuthGuard.canActivate(context)) as boolean;
    }

    throw new UnauthorizedException(
      'Skema autentikasi tidak didukung (Gunakan Basic/Bearer)',
    );
  }
}
