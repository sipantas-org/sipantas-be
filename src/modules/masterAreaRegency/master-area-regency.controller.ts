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
import { MasterAreaRegencyService } from './master-area-regency.service.js';
import { CreateRegencyDto } from './dto/create-regency.dto.js';
import { UpdateRegencyDto } from './dto/update-regency.dto.js';
import { QueryRegencyDto } from './dto/query-regency.dto.js';
import {
  RegencyDetailResponseDto,
  RegencyResponseDto,
} from './dto/regency-response.dto.js';
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

@ApiTags('master-area-regency')
@ApiBearerAuth('access-token')
@ApiExtraModels(RegencyResponseDto, PaginationMetaDto)
@Controller('regencies')
export class MasterAreaRegencyController {
  constructor(private readonly regencyService: MasterAreaRegencyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tambah Regency',
    description:
      'Menambahkan data master kabupaten/kota (regency) baru oleh administrator',
  })
  @ApiResponse({ status: 201, type: RegencyResponseDto })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh menambahkan regency',
  })
  @ApiResponse({
    status: 400,
    description: 'Province induk (provinceId) tidak ditemukan',
  })
  @ApiResponse({ status: 409, description: 'Regency dengan ID tersebut sudah ada' })
  create(@Body() createDto: CreateRegencyDto) {
    return this.regencyService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Daftar Regency',
    description:
      'Mengambil daftar regency secara terpaginasi, dengan filter provinceId dan pencarian nama',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar regency dengan informasi paging',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(RegencyResponseDto) },
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
  findAll(@Query() query: QueryRegencyDto) {
    return this.regencyService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, example: '11.01' })
  @ApiOperation({
    summary: 'Detail Regency',
    description: 'Mengambil detail regency beserta daftar district di dalamnya',
  })
  @ApiResponse({ status: 200, type: RegencyDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Regency tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.regencyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiParam({ name: 'id', type: String, example: '11.01' })
  @ApiOperation({
    summary: 'Perbarui Nama Regency',
    description:
      'Mengubah nama regency oleh administrator. ID dan provinceId regency tidak dapat diubah lewat endpoint ini.',
  })
  @ApiResponse({ status: 200, type: RegencyResponseDto })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh mengubah regency',
  })
  @ApiResponse({ status: 404, description: 'Regency tidak ditemukan' })
  update(@Param('id') id: string, @Body() updateDto: UpdateRegencyDto) {
    return this.regencyService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, example: '11.01' })
  @ApiOperation({
    summary: 'Hapus Regency',
    description:
      'Menghapus data regency oleh administrator. Menghapus regency akan ikut menghapus seluruh district dan village di bawahnya (cascade).',
  })
  @ApiResponse({ status: 204, description: 'Regency berhasil dihapus' })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh menghapus regency',
  })
  @ApiResponse({ status: 404, description: 'Regency tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.regencyService.remove(id);
  }
}
