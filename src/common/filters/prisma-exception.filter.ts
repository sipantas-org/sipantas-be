import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>(); // 1. Get the Request object
    const body = request.body || {}; // 2. Get the incoming payload

    switch (exception.code) {
      case 'P2002': {
        const meta = exception.meta as any;
        let fieldName = '';

        // Extract raw field name (e.g., "Disaster_Code")
        if (Array.isArray(meta?.target) && meta.target.length > 0) {
          fieldName = meta.target[0];
        } else if (meta?.driverAdapterError?.cause?.originalMessage) {
          const match =
            meta.driverAdapterError.cause.originalMessage.match(
              /constraint "([^"]+)"/,
            );
          if (match && match[1]) {
            fieldName = cleanConstraintName(match[1], meta?.modelName);
          }
        }

        // 3. Retrieve the actual value submitted in the request body
        const insertedValue =
          fieldName && body[fieldName] ? body[fieldName] : null;

        // Format field label and message
        const formattedField = fieldName
          ? fieldName.replace(/_/g, ' ')
          : 'Resource';

        const errorMessage = insertedValue
          ? `${formattedField} '${insertedValue}' already exists`
          : `${formattedField} already exists`;

        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'Resource already exists',
          errors: [errorMessage],
          timestamp: new Date().toISOString(),
        });
        break;
      }
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Database error occurred ${exception.code}`,
        });
        break;
    }
  }
}

function cleanConstraintName(
  constraintName: string,
  modelName?: string,
): string {
  let name = constraintName.replace(/_key$/, '').replace(/_unique$/, '');
  if (modelName && name.startsWith(`${modelName}_`)) {
    name = name.substring(modelName.length + 1);
  }
  return name;
}
