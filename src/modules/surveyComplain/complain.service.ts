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

@Injectable()
export class ComplainService {
  constructor(
    private readonly complainRepository: ComplainRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Menyimpan pengajuan komplain baru
   * NIK otomatis diambil dari data survei terkait
   * Berkas pendukung disimpan via ComplainRepository
   */
  async create(createDto: CreateSurveyComplainDto) {
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

    return plainToInstance(ComplainResponseDto, complain);
  }

  /** Survei Pending terbaru untuk NIK, beserta housingDetails + fileDetails. */
  async searchPendingSurveyByNik(nik: string) {
    const survey =
      await this.complainRepository.findLatestPendingSurveyByNik(nik);

    if (!survey) {
      throw new NotFoundException(
        'Tidak ditemukan survei berstatus Pending untuk NIK tersebut.',
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
  async updateStatus(id: number, dto: UpdateSurveyComplainStatusDto) {
    const complain = await this.findOne(id);

    const isResolved = dto.action === ComplainAction.Resolved;
    const nextComplainStatus = isResolved
      ? ComplainStatus.OnProgress
      : ComplainStatus.Completed;

    let surveyUpdate:
      { surveyId: number; surveyStatus: SurveyStatus } | undefined;

    if (isResolved) {
      const targetSurveyStatus =
        (SurveyStatus as Record<string, SurveyStatus>)['OnInvestigation'] ??
        SurveyStatus.OnComplain;

      surveyUpdate = {
        surveyId: complain.surveyId,
        surveyStatus: targetSurveyStatus,
      };
    }

    const result = await this.complainRepository.updateStatusWithTransaction({
      complainId: id,
      status: nextComplainStatus,
      action: dto.action,
      responseNotes: dto.description || null,
      surveyUpdate,
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
