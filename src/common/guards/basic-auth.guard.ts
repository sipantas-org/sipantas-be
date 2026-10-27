// src/common/guards/basic-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Basic authentication header is missing');
    }

    // Dekode string Base64 "username:password"
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );
    const [username, password] = credentials.split(':');

    const BASIC_AUTH_USER = process.env['BASIC_AUTH_USER'];
    const BASIC_AUTH_PASS = process.env['BASIC_AUTH_PASS'];

    if (username === BASIC_AUTH_USER && password === BASIC_AUTH_PASS) {
      // Tempelkan data identitas dasar ke request
      request['user'] = { username, role: 'system', authType: 'basic' };
      return true;
    }

    throw new UnauthorizedException('Invalid basic authentication credentials');
  }
}
