import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MasterAreaRegencyService } from './master-area-regency.service.js';
import { CreateRegencyDto } from './dto/create-regency.dto.js';
import { UpdateRegencyDto } from './dto/update-regency.dto.js';
import { QueryRegencyDto } from './dto/query-regency.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard.js';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator.js';
import { AdminRole } from '../../generated/prisma/enums.js';
import { UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('regencies')
export class MasterAreaRegencyController {
  constructor(private readonly regencyService: MasterAreaRegencyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateRegencyDto) {
    return this.regencyService.create(createDto);
  }

  @Get()
  findAll(@Query() query: QueryRegencyDto) {
    return this.regencyService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regencyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  update(@Param('id') id: string, @Body() updateDto: UpdateRegencyDto) {
    return this.regencyService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.regencyService.remove(id);
  }
}
