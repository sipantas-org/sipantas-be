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
import { MasterAreaVillageService } from './master-area-village.service.js';
import { CreateVillageDto } from './dto/create-village.dto.js';
import { UpdateVillageDto } from './dto/update-village.dto.js';
import { QueryVillageDto } from './dto/query-village.dto.js';
import {
  VillageResponseDto,
  VillageWithDistrictResponseDto,
} from './dto/village-response.dto.js';
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

@ApiTags('master-area-village')
@ApiBearerAuth('access-token')
@ApiExtraModels(VillageResponseDto, PaginationMetaDto)
@Controller('villages')
export class MasterAreaVillageController {
  constructor(private readonly villageService: MasterAreaVillageService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tambah Village',
    description:
      'Menambahkan data master desa/kelurahan (village) baru oleh administrator',
  })
  @ApiResponse({ status: 201, type: VillageWithDistrictResponseDto })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh menambahkan village',
  })
  @ApiResponse({
    status: 400,
    description: 'District induk (districtId) tidak ditemukan',
  })
  @ApiResponse({ status: 409, description: 'Village dengan ID tersebut sudah ada' })
  create(@Body() createDto: CreateVillageDto) {
    return this.villageService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Daftar Village',
    description:
      'Mengambil daftar village secara terpaginasi, dengan filter districtId, regencyId, provinceId, dan pencarian nama',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar village dengan informasi paging',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(VillageResponseDto) },
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
  findAll(@Query() query: QueryVillageDto) {
    return this.villageService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, example: '11.01.01.2001' })
  @ApiOperation({
    summary: 'Detail Village',
    description: 'Mengambil detail village',
  })
  @ApiResponse({ status: 200, type: VillageResponseDto })
  @ApiResponse({ status: 404, description: 'Village tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.villageService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiParam({ name: 'id', type: String, example: '11.01.01.2001' })
  @ApiOperation({
    summary: 'Perbarui Nama Village',
    description:
      'Mengubah nama village oleh administrator. ID dan districtId village tidak dapat diubah lewat endpoint ini.',
  })
  @ApiResponse({ status: 200, type: VillageWithDistrictResponseDto })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh mengubah village',
  })
  @ApiResponse({ status: 404, description: 'Village tidak ditemukan' })
  update(@Param('id') id: string, @Body() updateDto: UpdateVillageDto) {
    return this.villageService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, example: '11.01.01.2001' })
  @ApiOperation({
    summary: 'Hapus Village',
    description: 'Menghapus data village oleh administrator.',
  })
  @ApiResponse({ status: 204, description: 'Village berhasil dihapus' })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh menghapus village',
  })
  @ApiResponse({ status: 404, description: 'Village tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.villageService.remove(id);
  }
}
