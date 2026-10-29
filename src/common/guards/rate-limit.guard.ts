import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * Rate limiter in-memory sederhana, per IP, tanpa dependency eksternal.
 * @nestjs/throttler sengaja tidak dipakai karena versi terbarunya (6.7.1) masih
 * require() @nestjs/common secara CommonJS, padahal paket itu ESM-only di sini
 * (type: module) -> ERR_REQUIRE_ESM saat dijalankan dari dist/ build (termasuk di Vercel).
 */
export function createRateLimitGuard(limit: number, windowMs: number) {
  const store = new Map<string, RateLimitEntry>();

  @Injectable()
  class RateLimitGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const key: string =
        request.ip ?? request.socket?.remoteAddress ?? 'unknown';
      const now = Date.now();

      const entry = store.get(key);

      if (!entry || entry.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }

      if (entry.count >= limit) {
        throw new HttpException(
          'Terlalu banyak permintaan, coba lagi beberapa saat lagi.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      entry.count += 1;
      return true;
    }
  }

  return RateLimitGuard;
}
