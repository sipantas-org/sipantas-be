import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface.js';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    const errors = response.errors;

    return next.handle().pipe(
      map((data) => {
        // Jika controller mengembalikan object yang menyertakan custom message
        const message = data?.message || 'Request diproses berhasil';
        const resultData = data?.data !== undefined ? data.data : data;

        return {
          statusCode,
          success: true,
          message,
          errors: errors ?? null,
          data: resultData ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
