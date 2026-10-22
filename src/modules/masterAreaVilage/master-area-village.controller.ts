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
import { MasterAreaVillageService } from './master-area-village.service.js';
import { CreateVillageDto } from './dto/create-village.dto.js';
import { UpdateVillageDto } from './dto/update-village.dto.js';
import { QueryVillageDto } from './dto/query-village.dto.js';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard.js';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator.js';
import { AdminRole } from '../../generated/prisma/enums.js';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('villages')
export class MasterAreaVillageController {
  constructor(private readonly villageService: MasterAreaVillageService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateVillageDto) {
    return this.villageService.create(createDto);
  }

  @Get()
  findAll(@Query() query: QueryVillageDto) {
    return this.villageService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.villageService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  update(@Param('id') id: string, @Body() updateDto: UpdateVillageDto) {
    return this.villageService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.villageService.remove(id);
  }
}
