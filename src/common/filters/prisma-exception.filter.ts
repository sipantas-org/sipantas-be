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
    const meta = exception.meta as any;
    const modelName = extractModelName(meta);

    switch (exception.code) {
      case 'P2002': {
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
            fieldName = cleanConstraintName(match[1], modelName ?? undefined);
          }
        }

        // 3. Retrieve the actual value submitted in the request body
        const insertedValue =
          fieldName && body[fieldName] ? body[fieldName] : null;

        // Format field label and message
        const formattedField = fieldName
          ? fieldName.replace(/_/g, ' ')
          : 'Resource';

        const targetModel = modelName ? ` on model '${modelName}'` : '';
        const errorMessage = insertedValue
          ? `${formattedField} '${insertedValue}' already exists${targetModel}`
          : `${formattedField} already exists${targetModel}`;

        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'Resource already exists',
          model: modelName,
          errors: [errorMessage],
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
      }
      case 'P2003': {
        const fieldName = meta?.field_name
          ? String(meta.field_name).replace(/_/g, ' ')
          : 'Foreign key';
        const targetModel = modelName ? ` on model '${modelName}'` : '';
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Foreign key constraint violation',
          model: modelName,
          errors: [
            `Foreign key constraint failed on ${fieldName}${targetModel}`,
          ],
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
      }
      case 'P2025': {
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          model: modelName,
          errors: [
            meta?.cause ||
              `Record to update or delete not found${modelName ? ` in model '${modelName}'` : ''}`,
          ],
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
      }
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Database error occurred (${exception.code})${modelName ? ` on model '${modelName}'` : ''}`,
          model: modelName,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
    }
  }
}

function extractModelName(meta: any): string | null {
  if (meta?.modelName) {
    return meta.modelName;
  }
  const originalMessage = meta?.driverAdapterError?.cause?.originalMessage;
  if (typeof originalMessage === 'string') {
    const tableMatch = originalMessage.match(/(?:table|relation) "([^"]+)"/i);
    if (tableMatch && tableMatch[1]) return tableMatch[1];

    const constraintMatch = originalMessage.match(/constraint "([^"]+)"/i);
    if (constraintMatch && constraintMatch[1])
      return constraintMatch[1].split('_')[0];
  }
  return null;
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
