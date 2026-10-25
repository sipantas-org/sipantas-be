import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DisasterService } from './disaster.service.js';
import { CreateDisasterDto } from './dto/create-disaster.dto.js';
import { UpdateDisasterDto } from './dto/update-disaster.dto.js';
import { QueryDisasterDto } from './dto/query-disaster.dto.js';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard.js';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator.js';
import { AdminRole } from '../../generated/prisma/enums.js';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('disasters')
export class DisasterController {
  constructor(private readonly disasterService: DisasterService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDisasterDto: CreateDisasterDto) {
    return this.disasterService.create(createDisasterDto);
  }

  @Get()
  findAll(@Query() query: QueryDisasterDto) {
    return this.disasterService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.disasterService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDisasterDto: UpdateDisasterDto,
  ) {
    return this.disasterService.update(id, updateDisasterDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.disasterService.remove(id);
  }
}
