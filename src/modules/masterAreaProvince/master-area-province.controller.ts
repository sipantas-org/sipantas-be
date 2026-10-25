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
  UseGuards,
} from '@nestjs/common';
import { MasterAreaProvinceService } from './master-area-province.service.js';
import { CreateProvinceDto } from './dto/create-province.dto.js';
import { UpdateProvinceDto } from './dto/update-province.dto.js';
import { QueryProvinceDto } from './dto/query-province.dto.js';
import {
  ProvinceDetailResponseDto,
  ProvinceResponseDto,
} from './dto/province-response.dto.js';
import { PaginationMetaDto } from '../../dto/pagination-meta.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard.js';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator.js';
import { AdminRole } from '../../generated/prisma/enums.js';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('master-area-province')
@ApiBearerAuth('access-token')
@ApiExtraModels(ProvinceResponseDto, PaginationMetaDto)
@Controller('provinces')
export class MasterAreaProvinceController {
  constructor(private readonly provinceService: MasterAreaProvinceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tambah Provinsi',
    description: 'Menambahkan data master provinsi baru oleh administrator',
  })
  @ApiResponse({ status: 201, type: ProvinceResponseDto })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh menambahkan provinsi',
  })
  @ApiResponse({ status: 409, description: 'Province dengan ID tersebut sudah ada' })
  create(@Body() createDto: CreateProvinceDto) {
    return this.provinceService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Daftar Provinsi',
    description:
      'Mengambil daftar provinsi secara terpaginasi, dengan filter pencarian nama',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar provinsi dengan informasi paging',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ProvinceResponseDto) },
            },
          },
        },
        {
          properties: {
            pagination: { $ref: getSchemaPath(PaginationMetaDto) },
          },
        },
      ],
    },
  })
  findAll(@Query() query: QueryProvinceDto) {
    return this.provinceService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, example: '11' })
  @ApiOperation({
    summary: 'Detail Provinsi',
    description:
      'Mengambil detail provinsi beserta daftar regency di dalamnya',
  })
  @ApiResponse({ status: 200, type: ProvinceDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Province tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.provinceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiParam({ name: 'id', type: String, example: '11' })
  @ApiOperation({
    summary: 'Perbarui Nama Provinsi',
    description:
      'Mengubah nama provinsi oleh administrator. ID provinsi tidak dapat diubah lewat endpoint ini.',
  })
  @ApiResponse({ status: 200, type: ProvinceResponseDto })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh mengubah provinsi',
  })
  @ApiResponse({ status: 404, description: 'Province tidak ditemukan' })
  update(@Param('id') id: string, @Body() updateDto: UpdateProvinceDto) {
    return this.provinceService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, example: '11' })
  @ApiOperation({
    summary: 'Hapus Provinsi',
    description:
      'Menghapus data provinsi oleh administrator. Menghapus provinsi akan ikut menghapus seluruh regency, district, dan village di bawahnya (cascade).',
  })
  @ApiResponse({ status: 204, description: 'Province berhasil dihapus' })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh menghapus provinsi',
  })
  @ApiResponse({ status: 404, description: 'Province tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.provinceService.remove(id);
  }
}
