import { Controller, Get } from '@nestjs/common';

@Controller() // Tanpa prefix path = merujuk ke root '/'
export class AppController {
  @Get()
  getWelcome(): string {
    return 'Welcome to API SIPANTAS';
  }
}
