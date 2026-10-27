import type { SwaggerCustomOptions } from '@nestjs/swagger';

export const getSwaggerCustomOptions = (): SwaggerCustomOptions => {
  // Default Kredensial untuk Pengujian Local / Dev
  const defaultUser = process.env['BASIC_AUTH_USER'];
  const defaultPass = process.env['BASIC_AUTH_PASS'];
  const defaultJwtToken = process.env['JWT_TOKEN']; // Token dummy/dev

  return {
    swaggerOptions: {
      persistAuthorization: true, // Menyimpan token di localStorage agar tidak hilang saat di-refresh
    },
    // Injeksi JavaScript untuk mengisi kredensial otomatis saat halaman dimuat
    customJsStr: `
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          if (window.ui && window.ui.authActions) {
            window.ui.authActions.authorize({
              'basic-auth': {
                name: 'basic-auth',
                schema: { type: 'http', scheme: 'basic' },
                value: {
                username: '${defaultUser}',
                password: '${defaultPass}'
              }
              },
              'bearer-auth': {
                name: 'bearer-auth',
                schema: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                value: '${defaultJwtToken}'
              }
            });
          }
        }, 800);
      });
    `,
    jsonDocumentUrl: 'swagger/json',
  };
};
