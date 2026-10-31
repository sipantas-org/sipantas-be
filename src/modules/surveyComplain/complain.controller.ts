import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ComplainService } from './complain.service.js';
import { CreateSurveyComplainDto } from './dto/create-survey-complain.dto.js';
import { QuerySurveyComplainDto } from './dto/query-survey-complain.dto.js';
import { SearchSurveyByNikDto } from './dto/search-survey-by-nik.dto.js';
import { UpdateSurveyComplainStatusDto } from './dto/update-survey-complain-status.dto.js';
import { ComplainSurveyLookupResponseDto } from './dto/response-survey-complain.dto.js';
import { BasicAuthGuard } from '../../common/guards/basic-auth.guard.js';
import { CombinedAuthGuard } from '../../common/guards/combine-auth.guard.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { createRateLimitGuard } from '../../common/guards/rate-limit.guard.js';

const SearchByNikRateLimitGuard = createRateLimitGuard(5, 60000);

@ApiTags('survey-complains')
@Controller('survey-complains')
export class ComplainController {
  constructor(private readonly complainService: ComplainService) {}

  @Post()
  @UseGuards(CombinedAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBasicAuth('basic-auth')
  @ApiOperation({
    summary: 'Ajukan komplain survei',
    description:
      'Menyimpan data komplain survei baru beserta dokumen pendukung. NIK pelapor akan otomatis diambil dari data survei terkait. Hanya survei berstatus Pending yang dapat dikomplain.',
  })
  @ApiResponse({ status: 404, description: 'Survei tidak ditemukan' })
  @ApiResponse({
    status: 400,
    description: 'Survei tidak berstatus Pending, atau sudah ada komplain aktif',
  })
  create(@Body() createDto: CreateSurveyComplainDto) {
    return this.complainService.create(createDto);
  }

  @Get()
  @UseGuards(CombinedAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBasicAuth('basic-auth')
  @ApiOperation({
    summary: 'Daftar komplain survei',
    description:
      'Mengambil daftar seluruh komplain survei terpaginasi dengan filter status, NIK, pencarian, dan sorting.',
  })
  findAll(@Query() query: QuerySurveyComplainDto) {
    return this.complainService.findAll(query);
  }

  @Post('search-by-nik')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BasicAuthGuard, SearchByNikRateLimitGuard)
  @ApiBasicAuth('basic-auth')
  @ApiBody({ type: SearchSurveyByNikDto })
  @ApiOperation({
    summary: 'Cari survei Pending berdasarkan NIK',
    description:
      'Mencari survei berstatus Pending terbaru untuk NIK yang diberikan, beserta housingDetails dan ' +
      'fileDetails-nya (tanpa data surveyor/harga). Dibatasi 5 permintaan/menit per IP.',
  })
  @ApiResponse({ status: 200, type: ComplainSurveyLookupResponseDto })
  @ApiResponse({ status: 400, description: 'Format NIK tidak valid' })
  @ApiResponse({ status: 401, description: 'Basic Auth tidak valid' })
  @ApiResponse({
    status: 404,
    description:
      'Tidak ditemukan survei berstatus Pending untuk NIK tersebut (NIK tidak terdaftar, atau survei miliknya sudah tidak berstatus Pending)',
  })
  @ApiResponse({
    status: 429,
    description: 'Terlalu banyak permintaan dari IP ini, coba lagi beberapa saat lagi',
  })
  searchByNik(@Body() dto: SearchSurveyByNikDto) {
    return this.complainService.searchPendingSurveyByNik(dto.nik);
  }

  @Get(':id')
  @UseGuards(CombinedAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBasicAuth('basic-auth')
  @ApiOperation({
    summary: 'Detail komplain survei',
    description:
      'Mengambil rincian data komplain survei beserta relasi data survei dan dokumen pendukung.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID Komplain',
    type: Number,
    example: 1,
  })
  @ApiResponse({ status: 404, description: 'Komplain tidak ditemukan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.complainService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Perbarui status / tindak lanjut komplain',
    description:
      'Memperbarui status komplain dan catatan respon. Jika action disetujui (Resolved), status komplain diupdate dan status survei diperbarui via transaksi atomik.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID Komplain',
    type: Number,
    example: 1,
  })
  @ApiResponse({ status: 404, description: 'Komplain tidak ditemukan' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSurveyComplainStatusDto,
  ) {
    return this.complainService.updateStatus(id, dto);
  }
}
