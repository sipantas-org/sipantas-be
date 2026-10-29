import { NestFactory } from '@nestjs/core';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppModule } from './app.module.js';
import { configureApp } from './main.js';

type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;

// Vercel (serverless) deployment only. Not used by local dev or start:prod (see main.ts).
// Builds the app once per instance and reuses it across requests.
let listener: Promise<RequestListener> | undefined;

function createListener(): Promise<RequestListener> {
  return (async () => {
    const app = await NestFactory.create(AppModule);
    configureApp(app);
    await app.init();
    return app.getHttpAdapter().getInstance() as RequestListener;
  })();
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  listener ??= createListener();
  try {
    (await listener)(req, res);
  } catch (error) {
    listener = undefined; // let the next request retry after a failed boot
    throw error;
  }
}
