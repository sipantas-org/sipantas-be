import {
  Body,
  Controller,
  Get,
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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ComplainService } from './complain.service.js';
import { CreateSurveyComplainDto } from './dto/create-survey-complain.dto.js';
import { QuerySurveyComplainDto } from './dto/query-survey-complain.dto.js';
import { UpdateSurveyComplainStatusDto } from './dto/update-survey-complain-status.dto.js';
import { CombinedAuthGuard } from '../../common/guards/combine-auth.guard.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('survey-complains')
@ApiBearerAuth('access-token')
@Controller('survey-complains')
export class ComplainController {
  constructor(private readonly complainService: ComplainService) {}

  @Post()
  @UseGuards(CombinedAuthGuard)
  @ApiBasicAuth('basic-auth')
  @ApiOperation({
    summary: 'Ajukan komplain survei',
    description:
      'Menyimpan data komplain survei baru beserta dokumen pendukung. NIK pelapor akan otomatis diambil dari data survei terkait.',
  })
  @ApiResponse({ status: 404, description: 'Survei tidak ditemukan' })
  create(@Body() createDto: CreateSurveyComplainDto) {
    return this.complainService.create(createDto);
  }

  @Get()
  @UseGuards(CombinedAuthGuard)
  @ApiBasicAuth('basic-auth')
  @ApiOperation({
    summary: 'Daftar komplain survei',
    description:
      'Mengambil daftar seluruh komplain survei terpaginasi dengan filter status, NIK, pencarian, dan sorting.',
  })
  findAll(@Query() query: QuerySurveyComplainDto) {
    return this.complainService.findAll(query);
  }

  @Get(':id')
  @UseGuards(CombinedAuthGuard)
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
