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
import { ListAdminDto } from './dto/list-admin.dto.js';
import { UpdateSurveyorProfileDto } from './dto/update-surveyor-profile.dto.js';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto.js';
import { UpdateSurveyorStatusDto } from './dto/update-surveyor-status.dto.js';
import { UpdateAdminStatusDto } from './dto/update-admin-status.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard.js';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator.js';
import { SurveyorGuard } from '../../common/guards/surveyor.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';
import { AdminRole } from '../../generated/prisma/enums.js';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ApprovalUserResponseDto,
  LoginAdminResponseDto,
  LoginSurveyorResponseDto,
  PaginatedAdminResponseDto,
  PaginatedSurveyorResponseDto,
  UserAdminResponseDto,
  UserSurveyorResponseDto,
} from './dto/response-auth.dto.js';

@ApiTags('auth')
@ApiBearerAuth('access-token')
@ApiExtraModels(UserAdminResponseDto, UserSurveyorResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @ApiOperation({
    summary: 'Login Admin',
    description:
      'Endpoint untuk melakukan autentikasi dan login akun administrator',
  })
  @ApiResponse({ status: 201, type: LoginAdminResponseDto })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  @ApiResponse({ status: 403, description: 'Akun admin berstatus Inactive' })
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
  @ApiResponse({ status: 201, type: UserAdminResponseDto })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  @ApiResponse({
    status: 403,
    description: 'Hanya administrator yang boleh mendaftarkan admin baru',
  })
  @ApiResponse({ status: 409, description: 'NIP atau email sudah terdaftar' })
  registerAdmin(@Body() dto: RegisterAdminDto) {
    return this.authService.registerAdmin(dto);
  }

  @Patch('admin/profile')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiOperation({
    summary: 'Perbarui Profil Admin',
    description:
      'Memperbarui nomor telepon, email, atau password untuk akun admin yang sedang login. Mengganti password wajib menyertakan currentPassword yang valid.',
  })
  @ApiResponse({ status: 200, type: UserAdminResponseDto })
  @ApiResponse({
    status: 401,
    description: 'Token tidak valid, atau currentPassword salah',
  })
  @ApiResponse({ status: 403, description: 'Token bukan milik akun admin' })
  @ApiResponse({ status: 409, description: 'Email sudah dipakai akun lain' })
  updateAdminProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateAdminProfileDto,
  ) {
    return this.authService.updateAdminProfile(user, dto);
  }

  @Patch('admin/status/:id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOperation({
    summary: 'Perbarui Status Akun Admin Monitoring',
    description:
      'Mengubah status akun admin role Monitoring (Active atau Inactive) oleh administrator',
  })
  @ApiResponse({ status: 200, type: UserAdminResponseDto })
  @ApiResponse({ status: 400, description: 'status harus Active atau Inactive' })
  @ApiResponse({ status: 403, description: 'Hanya administrator yang boleh mengubah status admin' })
  @ApiResponse({ status: 404, description: 'Admin tidak ditemukan' })
  updateAdminStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.authService.updateAdminStatus(id, dto, user);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator)
  @ApiOperation({
    summary: 'Daftar Admin Monitoring',
    description:
      'Mengambil daftar admin dengan role Monitoring secara terpaginasi, dengan filter status, untuk administrator',
  })
  @ApiResponse({ status: 200, type: PaginatedAdminResponseDto })
  @ApiResponse({ status: 403, description: 'Hanya administrator yang boleh mengakses daftar admin' })
  listAdmins(@Query() query: ListAdminDto) {
    return this.authService.listAdmins(query);
  }

  @Post('surveyor/login')
  @ApiOperation({
    summary: 'Login Surveyor',
    description: 'Endpoint untuk melakukan autentikasi dan login akun surveyor',
  })
  @ApiResponse({ status: 201, type: LoginSurveyorResponseDto })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  @ApiResponse({
    status: 403,
    description:
      'Akun surveyor belum Active (masih Pending, Rejected, atau sudah Inactive)',
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
  @ApiResponse({ status: 201, type: UserSurveyorResponseDto })
  @ApiResponse({ status: 409, description: 'NIP atau email sudah terdaftar' })
  registerSurveyor(@Body() dto: RegisterSurveyorDto) {
    return this.authService.registerSurveyor(dto);
  }

  @Patch('surveyor/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Perbarui Profil Surveyor',
    description:
      'Memperbarui nomor telepon, email, password, provinsi, atau kabupaten/kota untuk akun surveyor yang sedang login. Mengganti password wajib menyertakan currentPassword yang valid.',
  })
  @ApiResponse({ status: 200, type: UserSurveyorResponseDto })
  @ApiResponse({
    status: 401,
    description: 'Token tidak valid, atau currentPassword salah',
  })
  @ApiResponse({ status: 403, description: 'Token bukan milik akun surveyor' })
  @ApiResponse({ status: 409, description: 'Email sudah dipakai akun lain' })
  updateSurveyorProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateSurveyorProfileDto,
  ) {
    return this.authService.updateSurveyorProfile(user, dto);
  }

  @Patch('surveyor/status/:id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator, AdminRole.Monitoring)
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOperation({
    summary: 'Perbarui Status Akun Surveyor',
    description:
      'Mengubah status akun surveyor (Active atau Inactive) oleh administrator',
  })
  @ApiResponse({ status: 200, type: UserSurveyorResponseDto })
  @ApiResponse({ status: 400, description: 'status harus Active atau Inactive' })
  @ApiResponse({ status: 404, description: 'Surveyor tidak ditemukan' })
  updateSurveyorStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSurveyorStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.authService.updateSurveyorStatus(id, dto, user);
  }

  @Patch('surveyor/approval/:id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator, AdminRole.Monitoring)
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOperation({
    summary: 'Persetujuan Registrasi Surveyor',
    description:
      'Menyetujui (Approved) atau menolak (Rejected) pendaftaran surveyor oleh admin',
  })
  @ApiResponse({ status: 200, type: ApprovalUserResponseDto })
  @ApiResponse({ status: 404, description: 'Surveyor tidak ditemukan' })
  @ApiResponse({
    status: 409,
    description: 'Surveyor tidak sedang berstatus Pending',
  })
  approveSurveyor(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApproveSurveyorDto,
    @CurrentUser() admin: JwtPayload,
  ) {
    return this.authService.approveSurveyor(id, dto, admin);
  }
  
  @Get('surveyor')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.Administrator, AdminRole.Monitoring)
  @ApiOperation({
    summary: 'Daftar Surveyor',
    description:
      'Mengambil daftar surveyor secara terpaginasi dengan filter status untuk administrator',
  })
  @ApiResponse({ status: 200, type: PaginatedSurveyorResponseDto })
  listSurveyors(@Query() query: ListSurveyorDto) {
    return this.authService.listSurveyors(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Profil User Login',
    description: 'Mengambil data profil pengguna yang sedang login',
  })
  @ApiResponse({
    status: 200,
    description: 'UserAdminResponseDto jika login sebagai admin, UserSurveyorResponseDto jika login sebagai surveyor',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(UserAdminResponseDto) },
        { $ref: getSchemaPath(UserSurveyorResponseDto) },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Token tidak ada atau tidak valid' })
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user);
  }
}
