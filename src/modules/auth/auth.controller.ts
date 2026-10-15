import {
  Body,
  Controller,
  Headers,
  Get,
  Ip,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterSurveyorDto } from './dto/register-surveyor.dto.js';
import { ApproveSurveyorDto } from './dto/approve-surveyor.dto.js';
import { RegisterAdminDto } from './dto/register-admin.dto.js';
import { ListSurveyorDto } from './dto/list-surveyor.dto.js';
import { UpdateSurveyorProfileDto } from './dto/update-surveyor-profile.dto.js';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto.js';
import { UpdateSurveyorStatusDto } from './dto/update-surveyor-status.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard.js';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';
import { AdminRole } from '../../generated/prisma/enums.js';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @ApiOperation({
    summary: 'Login Admin',
    description:
      'Endpoint untuk melakukan autentikasi dan login akun administrator',
  })
  loginAdmin(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.authService.loginAdmin(dto, {
      ipAddress: ip,
      deviceInfo: userAgent,
    });
  }

  @Post('admin/register')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiOperation({
    summary: 'Registrasi Admin Baru',
    description:
      'Endpoint untuk mendaftarkan akun admin baru oleh administrator',
  })
  registerAdmin(@Body() dto: RegisterAdminDto) {
    return this.authService.registerAdmin(dto);
  }

  @Get('surveyor')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiOperation({
    summary: 'Daftar Surveyor',
    description:
      'Mengambil daftar surveyor secara terpaginasi dengan filter status untuk administrator',
  })
  listSurveyors(@Query() query: ListSurveyorDto) {
    return this.authService.listSurveyors(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Profil User Login',
    description: 'Mengambil data profil pengguna yang sedang login',
  })
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user);
  }

  @Patch('admin/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Perbarui Profil Admin',
    description:
      'Memperbarui nomor telepon, email, atau password untuk akun admin yang sedang login',
  })
  updateAdminProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateAdminProfileDto,
  ) {
    return this.authService.updateAdminProfile(user, dto);
  }

  @Patch('surveyor/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Perbarui Profil Surveyor',
    description:
      'Memperbarui nomor telepon, email, password, provinsi, atau kabupaten/kota untuk akun surveyor yang sedang login',
  })
  updateSurveyorProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateSurveyorProfileDto,
  ) {
    return this.authService.updateSurveyorProfile(user, dto);
  }

  @Get('surveyor/:id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiOperation({
    summary: 'Detail Surveyor',
    description:
      'Mengambil data detail akun surveyor berdasarkan ID surveyor (khusus administrator)',
  })
  getSurveyorById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getSurveyorById(id);
  }

  @Patch('surveyor/:id/status')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiOperation({
    summary: 'Perbarui Status Akun Surveyor',
    description:
      'Mengubah status akun surveyor (Active atau Inactive) oleh administrator',
  })
  updateSurveyorStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSurveyorStatusDto,
  ) {
    return this.authService.updateSurveyorStatus(id, dto);
  }

  @Post('surveyor/login')
  @ApiOperation({
    summary: 'Login Surveyor',
    description: 'Endpoint untuk melakukan autentikasi dan login akun surveyor',
  })
  loginSurveyor(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.authService.loginSurveyor(dto, {
      ipAddress: ip,
      deviceInfo: userAgent,
    });
  }

  @Post('surveyor/register')
  @ApiOperation({
    summary: 'Registrasi Surveyor Baru',
    description:
      'Endpoint publik untuk pendaftaran akun surveyor baru dengan status pending',
  })
  registerSurveyor(@Body() dto: RegisterSurveyorDto) {
    return this.authService.registerSurveyor(dto);
  }

  @Patch('surveyor/:id/approval')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiOperation({
    summary: 'Persetujuan Registrasi Surveyor',
    description:
      'Menyetujui (Approved) atau menolak (Rejected) pendaftaran surveyor oleh administrator',
  })
  approveSurveyor(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApproveSurveyorDto,
    @CurrentUser() admin: JwtPayload,
  ) {
    return this.authService.approveSurveyor(id, dto, admin);
  }
}
