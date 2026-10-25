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
import { MasterAreaDistrictService } from './master-area-district.service.js';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';
import { QueryDistrictDto } from './dto/query-district.dto.js';
import {
  DistrictDetailResponseDto,
  DistrictListItemResponseDto,
  DistrictWithRegencyResponseDto,
} from './dto/district-response.dto.js';
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

@ApiTags('master-area-district')
@ApiBearerAuth('access-token')
@ApiExtraModels(DistrictListItemResponseDto, PaginationMetaDto)
@Controller('districts')
export class MasterAreaDistrictController {
  constructor(private readonly districtService: MasterAreaDistrictService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tambah District',
    description:
      'Menambahkan data master kecamatan (district) baru oleh administrator',
  })
  @ApiResponse({ status: 201, type: DistrictWithRegencyResponseDto })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh menambahkan district',
  })
  @ApiResponse({
    status: 400,
    description: 'Regency induk (regencyId) tidak ditemukan',
  })
  @ApiResponse({ status: 409, description: 'District dengan ID tersebut sudah ada' })
  create(@Body() createDto: CreateDistrictDto) {
    return this.districtService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Daftar District',
    description:
      'Mengambil daftar district secara terpaginasi, dengan filter regencyId, provinceId, dan pencarian nama. Setiap item menyertakan nama regency (kabupaten/kota) dan provinsi induknya.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar district dengan informasi paging',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(DistrictListItemResponseDto) },
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
  findAll(@Query() query: QueryDistrictDto) {
    return this.districtService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, example: '11.01.01' })
  @ApiOperation({
    summary: 'Detail District',
    description: 'Mengambil detail district beserta daftar village di dalamnya',
  })
  @ApiResponse({ status: 200, type: DistrictDetailResponseDto })
  @ApiResponse({ status: 404, description: 'District tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiParam({ name: 'id', type: String, example: '11.01.01' })
  @ApiOperation({
    summary: 'Perbarui Nama District',
    description:
      'Mengubah nama district oleh administrator. ID dan regencyId district tidak dapat diubah lewat endpoint ini.',
  })
  @ApiResponse({ status: 200, type: DistrictWithRegencyResponseDto })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh mengubah district',
  })
  @ApiResponse({ status: 404, description: 'District tidak ditemukan' })
  update(@Param('id') id: string, @Body() updateDto: UpdateDistrictDto) {
    return this.districtService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, example: '11.01.01' })
  @ApiOperation({
    summary: 'Hapus District',
    description:
      'Menghapus data district oleh administrator. Menghapus district akan ikut menghapus seluruh village di bawahnya (cascade).',
  })
  @ApiResponse({ status: 204, description: 'District berhasil dihapus' })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh menghapus district',
  })
  @ApiResponse({ status: 404, description: 'District tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.districtService.remove(id);
  }
}
