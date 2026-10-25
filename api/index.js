// Vercel (serverless) deployment only. Local dev and start:prod use src/main.ts instead.
// Entrypoint that delegates to the compiled NestJS handler (npm run build -> dist/).
export { default } from '../dist/serverless.js';
