import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter.js';
import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { DISPLAY_NAME_KEY } from './common/decorators/display-name.decorator.js';
import { getSwaggerCustomOptions } from './swagger-dev.js';

// --- Vercel deploy: exported so src/serverless.ts can reuse it (same setup as local) ---
export function configureApp(app: INestApplication) {
  const customOptions = getSwaggerCustomOptions();
  const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim());
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaClientExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const detailedErrors = validationErrors.map((error) => {
          // 1. Check if @DisplayName exists on the DTO property
          const customDisplayName =
            error.target &&
            Reflect.getMetadata(DISPLAY_NAME_KEY, error.target, error.property);

          // 2. Use custom name if present; fallback to regex auto-capitalization
          const fieldName = customDisplayName || error.property;

          const messages = error.constraints
            ? Object.values(error.constraints).map((msg) =>
                msg.replace(error.property, fieldName),
              )
            : [];

          return {
            field: fieldName,
            messages,
          };
        });

        const errorMessages = detailedErrors.flatMap((e) => e.messages);

        return new BadRequestException({
          statusCode: 400,
          success: false,
          message: errorMessages,
          errors: detailedErrors,
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SIPANTAS API')
    .setDescription('SIPANTAS API Documentation')
    .setVersion('1.0')
    .addTag('SIPANTAS')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter Bearer token',
        in: 'header',
      },
      'access-token',
    )
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
        description: 'Enter username & password',
      },
      'basic-auth',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, documentFactory, customOptions);
}
// --- end Vercel deploy ---

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  await app.listen(process.env.PORT ?? 3000);
}

// --- Vercel deploy: serverless.ts imports this file, so don't listen() there ---
if (!process.env.VERCEL) {
  await bootstrap();
}
// --- end Vercel deploy ---
