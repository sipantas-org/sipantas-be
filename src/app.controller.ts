import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Welcome')
@Controller() // Tanpa prefix path = merujuk ke root '/'
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Welcome Endpoint' })
  getWelcome(): string {
    return 'Welcome to API SIPANTAS';
  }
}
