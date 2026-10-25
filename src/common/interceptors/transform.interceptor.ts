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

// Extend dayjs plugins ONCE outside class execution to avoid performance overhead on every request
dayjs.extend(utc);
dayjs.extend(timezone);

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
        const message = data?.message || 'Success';

        // Detect pagination object (handles both 'meta' and 'pagination' from service/repo)
        const pagination = data?.pagination || data?.meta;
        const hasPagination =
          pagination !== undefined && data?.data !== undefined;

        // If paginated, extract inner data array; otherwise fall back to standard response data logic
        const resultData = hasPagination
          ? data.data
          : data?.data !== undefined
            ? data.data
            : data;

        const dateTime = dayjs()
          .tz('Asia/Jakarta')
          .format('YYYY-MM-DD HH:mm:ss');

        return {
          statusCode,
          success: true,
          message,
          errors: errors ?? null,
          data: resultData ?? null,
          ...(pagination ? { pagination } : {}), // Dynamically includes 'pagination' key
          timestamp: dateTime,
        };
      }),
    );
  }
}
