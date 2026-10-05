import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

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
        const message = data?.message || 'Success';
        const resultData = data?.data !== undefined ? data.data : data;

        dayjs.extend(utc);
        dayjs.extend(timezone);

        const dateTime = dayjs()
          .tz('Asia/Jakarta')
          .format('YYYY-MM-DD HH:mm:ss');

        return {
          statusCode,
          success: true,
          message,
          errors: errors ?? null,
          data: resultData ?? null,
          timestamp: dateTime,
        };
      }),
    );
  }
}
