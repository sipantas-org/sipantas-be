import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    console.log(exception);

    dayjs.extend(utc);
    dayjs.extend(timezone);

    const dateTime = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    // Ambil pesan error (dukungan untuk Class-Validator array message)
    let message = 'An unexpected error occurred on the server';
    let errors = null;
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse.message
    ) {
      message = Array.isArray(exceptionResponse.message)
        ? 'Error Validation'
        : exceptionResponse.message;
      if (message === 'Error Validation') {
        errors = exceptionResponse.message.map((val: string) => {
          val = val.replace(/_/g, ' ');
          return val;
        });
      }
    }

    response.status(status).json({
      statusCode: status,
      success: false,
      message,
      data: null,
      errors: errors,
      timestamp: dateTime,
      path: request.url,
    });
  }
}
