import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ComplainRepository } from './repositories/complain.repository.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSurveyComplainDto } from './dto/create-survey-complain.dto.js';
import { QuerySurveyComplainDto } from './dto/query-survey-complain.dto.js';
import { UpdateSurveyComplainStatusDto } from './dto/update-survey-complain-status.dto.js';
import {
  ComplainAction,
  ComplainStatus,
  SurveyStatus,
} from '../../generated/prisma/enums.js';
import {
  ComplainResponseDto,
  ComplainSurveyLookupResponseDto,
} from './dto/response-survey-complain.dto.js';
import { ActivityHistoryService } from '../activityHistory/activity-history.service.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';

// Pelaku aktivitas bisa tidak teridentifikasi (mis. Basic Auth publik).
function actorFrom(user?: JwtPayload) {
  if (user?.userType === 'admin') return { idUser: null, idAdmin: user.sub };
  if (user?.userType === 'surveyor') return { idUser: user.sub, idAdmin: null };
  return { idUser: null, idAdmin: null };
}

@Injectable()
export class ComplainService {
  constructor(
    private readonly complainRepository: ComplainRepository,
    private readonly prisma: PrismaService,
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  /**
   * Menyimpan pengajuan komplain baru
   * NIK otomatis diambil dari data survei terkait
   * Berkas pendukung disimpan via ComplainRepository
   */
  async create(createDto: CreateSurveyComplainDto, user?: JwtPayload) {
    const survey = await this.prisma.survey.findUnique({
      where: { surveyId: createDto.surveyId },
      select: { surveyId: true, nik: true, surveyStatus: true },
    });

    if (!survey) {
      throw new NotFoundException(
        `Data survei dengan ID ${createDto.surveyId} tidak ditemukan.`,
      );
    }

    if (survey.surveyStatus !== SurveyStatus.Pending) {
      throw new BadRequestException(
        'Survei ini tidak dapat dikomplain karena status saat ini bukan Pending.',
      );
    }

    const activeComplain = await this.complainRepository.findActiveBySurveyId(
      createDto.surveyId,
    );

    if (activeComplain) {
      throw new BadRequestException(
        `Masih ada komplain yang sedang berjalan untuk survei tersebut.`,
      );
    }

    const complain = await this.complainRepository.create({
      surveyId: createDto.surveyId,
      complainantName: createDto.complainantName,
      complainantNik: survey.nik,
      complainantPhone: createDto.complainantPhone,
      description: createDto.description,
      files: createDto.files,
    });

    await this.activityHistoryService.record({
      ...actorFrom(user),
      relationId: complain.complainId,
      module: 'Survey Complain - Create',
      activity: `Submitted complaint for survey #${createDto.surveyId}`,
    });

    return plainToInstance(ComplainResponseDto, complain);
  }

  /** Survei Pending terbaru untuk NIK, beserta housingDetails + fileDetails. */
  async searchPendingSurveyByNik(nik: string) {
    const survey =
      await this.complainRepository.findLatestPendingSurveyByNik(nik);

    if (!survey) {
      throw new NotFoundException('Tidak ditemukan survei untuk NIK tersebut.');
    }

    if (
      survey.surveyStatus == SurveyStatus.OnComplain ||
      survey.surveyStatus == SurveyStatus.OnVerification
    ) {
      throw new NotFoundException('Komplain untuk survei sedang dalam proses.');
    }

    if (survey.surveyStatus != SurveyStatus.Pending) {
      throw new NotFoundException(
        'Tidak bisa melakukan pengajuan komplain untuk survei ini.',
      );
    }

    return plainToInstance(ComplainSurveyLookupResponseDto, survey, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Mengambil daftar data komplain dengan paginasi, filter, dan sorting
   */
  async findAll(query: QuerySurveyComplainDto) {
    return this.complainRepository.findAll(query);
  }

  /**
   * Mengambil detail komplain berdasarkan ID
   */
  async findOne(id: number) {
    const complain = await this.complainRepository.findById(id);

    if (!complain) {
      throw new NotFoundException(
        `Data komplain survei dengan ID ${id} tidak ditemukan.`,
      );
    }

    return plainToInstance(ComplainResponseDto, complain);
  }

  /**
   * Memperbarui status/action komplain secara atomik via repository transaction
   */
  async updateStatus(
    id: number,
    dto: UpdateSurveyComplainStatusDto,
    user: JwtPayload,
  ) {
    const complain = await this.findOne(id);

    const isResolved = dto.action === ComplainAction.Resolved;
    const nextComplainStatus = isResolved
      ? ComplainStatus.OnProgress
      : ComplainStatus.Completed;

    let surveyUpdate:
      { surveyId: number; surveyStatus: SurveyStatus } | undefined;

    if (isResolved) {
      surveyUpdate = {
        surveyId: complain.surveyId,
        surveyStatus: SurveyStatus.OnVerification,
      };
    }

    const result = await this.complainRepository.updateStatusWithTransaction({
      complainId: id,
      status: nextComplainStatus,
      action: dto.action,
      responseNotes: dto.description || null,
      surveyUpdate,
    });

    await this.activityHistoryService.record({
      ...actorFrom(user),
      relationId: id,
      module: 'Survey Complain - Status Update',
      activity: `Updated complaint status (action: ${dto.action})`,
    });

    return plainToInstance(ComplainResponseDto, result);
  }

  /**
   * Menghapus komplain berdasarkan ID
   */
  async remove(id: number) {
    await this.findOne(id);
    return this.complainRepository.delete(id);
  }
}
