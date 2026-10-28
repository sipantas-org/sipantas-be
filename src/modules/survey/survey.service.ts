import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  SurveyRepository,
  CreateSurveyFileDetailItem,
} from './repositories/survey.repository.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSurveyDto, SurveyFileItemDto } from './dto/create-survey.dto.js';
import { UpdateSurveyDto } from './dto/update-survey.dto.js';
import { UpdateSurveyStatusDto } from './dto/update-survey-status.dto.js';
import type { Prisma } from '../../generated/prisma/client.js';
import {
  ComplainStatus,
  DamageLevel,
  SurveyStatus,
} from '../../generated/prisma/enums.js';
import { QuerySurveyDto } from './dto/query-survey.dto.js';

const DAMAGE_SCORE_THRESHOLDS = {
  HEAVY: 70,
  MEDIUM: 30,
  LIGHT: 20,
} as const;

@Injectable()
export class SurveyService {
  constructor(
    private readonly surveyRepository: SurveyRepository,
    private readonly prisma: PrismaService,
  ) {}

  private formatFiles(
    files?: SurveyFileItemDto[],
  ): CreateSurveyFileDetailItem[] | undefined {
    if (!files) return undefined;

    return files.map((item) => ({
      category: item.category,
      filePath: item.filePath,
      fileName: item.fileName,
    }));
  }

  private calculateDamageLevelAndScore(
    housingDetails?: Array<{ score?: number | string }>,
  ): { damageLevel: DamageLevel; totalScore: string } {
    const totalHousingScore =
      housingDetails && housingDetails.length > 0
        ? housingDetails.reduce(
            (sum, item) => sum + (Number(item.score) || 0),
            0,
          )
        : null;

    let damage: DamageLevel;
    if (totalHousingScore !== null) {
      if (totalHousingScore > DAMAGE_SCORE_THRESHOLDS.HEAVY) {
        damage = DamageLevel.Berat;
      } else if (totalHousingScore > DAMAGE_SCORE_THRESHOLDS.MEDIUM) {
        damage = DamageLevel.Sedang;
      } else if (totalHousingScore >= DAMAGE_SCORE_THRESHOLDS.LIGHT) {
        damage = DamageLevel.Ringan;
      } else {
        damage = DamageLevel.TMK;
      }
    } else {
      damage = DamageLevel.TMK;
    }

    return {
      damageLevel: damage,
      totalScore: totalHousingScore?.toString() ?? '',
    };
  }

  async create(dto: CreateSurveyDto) {
    const {
      surveyorId,
      provinceId,
      regencyId,
      districtId,
      villageId,
      volumeUnitOther,
      files,
      furnitureDetails,
      housingDetails,
      lostDetails,
      ...rest
    } = dto;

    await this.validateForeignEntities({
      surveyorId,
      provinceId,
      regencyId,
      districtId,
      villageId,
    });

    await this.validateUniqueHousingAssessmentParts(housingDetails);

    const { damageLevel, totalScore } =
      this.calculateDamageLevelAndScore(housingDetails);

    const data: Prisma.SurveyCreateInput = {
      ...rest,
      damageLevel,
      totalScore,
      volumeUnitOther: volumeUnitOther ?? '',
      ...(surveyorId ? { surveyor: { connect: { surveyorId } } } : {}),
      ...(provinceId ? { province: { connect: { id: provinceId } } } : {}),
      ...(regencyId ? { regency: { connect: { id: regencyId } } } : {}),
      ...(districtId ? { district: { connect: { id: districtId } } } : {}),
      ...(villageId ? { village: { connect: { id: villageId } } } : {}),
    };

    const fileDetails = this.formatFiles(files);

    return this.surveyRepository.createWithDetails({
      data,
      furnitureDetails,
      housingDetails,
      lostDetails,
      fileDetails,
    });
  }

  async findAll(query: QuerySurveyDto) {
    return this.surveyRepository.findAll(query);
  }

  async findOne(id: number) {
    const survey = await this.surveyRepository.findById(id);
    if (!survey) {
      throw new NotFoundException(`Survey tidak ditemukan`);
    }
    return survey;
  }

  async update(id: number, dto: UpdateSurveyDto) {
    const survey = await this.findOne(id);

    const allowedStatuses: SurveyStatus[] = [
      SurveyStatus.Pending,
      SurveyStatus.OnVerification,
    ];

    if (!allowedStatuses.includes(survey.surveyStatus)) {
      throw new BadRequestException(
        `Hanya survei dengan status ${allowedStatuses.join(' atau ')} yang dapat diupdate`,
      );
    }

    const isOnVerification =
      survey.surveyStatus === SurveyStatus.OnVerification;

    const {
      provinceId,
      regencyId,
      districtId,
      villageId,
      volumeUnitOther,
      files,
      furnitureDetails,
      housingDetails,
      lostDetails,
      ...rest
    } = dto;

    await this.validateForeignEntities({
      provinceId,
      regencyId,
      districtId,
      villageId,
    });

    if (housingDetails !== undefined) {
      await this.validateUniqueHousingAssessmentParts(housingDetails);
    }

    const damageAssessment =
      housingDetails !== undefined
        ? this.calculateDamageLevelAndScore(housingDetails)
        : undefined;

    const data: Prisma.SurveyUpdateInput = {
      ...rest,
      ...(isOnVerification ? { surveyStatus: SurveyStatus.Pending } : {}),
      ...(damageAssessment !== undefined
        ? {
            damageLevel: damageAssessment.damageLevel,
            totalScore: damageAssessment.totalScore,
          }
        : {}),
      ...(volumeUnitOther !== undefined
        ? { volumeUnitOther: volumeUnitOther ?? '' }
        : {}),
      ...(provinceId !== undefined
        ? provinceId
          ? { province: { connect: { id: provinceId } } }
          : { province: { disconnect: true } }
        : {}),
      ...(regencyId !== undefined
        ? regencyId
          ? { regency: { connect: { id: regencyId } } }
          : { regency: { disconnect: true } }
        : {}),
      ...(districtId !== undefined
        ? districtId
          ? { district: { connect: { id: districtId } } }
          : { district: { disconnect: true } }
        : {}),
      ...(villageId !== undefined
        ? villageId
          ? { village: { connect: { id: villageId } } }
          : { village: { disconnect: true } }
        : {}),
    };

    const fileDetails =
      files !== undefined ? this.formatFiles(files) : undefined;

    const updatedSurvey = await this.surveyRepository.updateWithDetails(id, {
      data,
      furnitureDetails,
      housingDetails,
      lostDetails,
      fileDetails,
    });

    if (isOnVerification) {
      const activeComplain = await this.prisma.surveyComplain.findFirst({
        where: {
          surveyId: id,
          status: ComplainStatus.OnProgress,
        },
      });

      if (activeComplain) {
        await this.prisma.surveyComplain.update({
          where: { complainId: activeComplain.complainId },
          data: { status: ComplainStatus.Completed },
        });
      }
    }

    return updatedSurvey;
  }

  async updateStatus(id: number, dto: UpdateSurveyStatusDto) {
    const survey = await this.findOne(id);
    const currentStatus = survey.surveyStatus;
    const targetStatus = dto.surveyStatus;

    if (
      targetStatus === SurveyStatus.OnBudgeting &&
      (!dto.sourceOfBudgetting || !dto.sourceOfBudgetting.trim())
    ) {
      throw new BadRequestException(
        `Source of Budgetting wajib diisi ketika status diubah ke ${SurveyStatus.OnBudgeting}`,
      );
    }

    switch (targetStatus) {
      case SurveyStatus.OnBudgeting:
        if (currentStatus !== SurveyStatus.Pending) {
          throw new BadRequestException(
            `Status hanya dapat diubah ke ${targetStatus} jika status saat ini adalah ${SurveyStatus.Pending}`,
          );
        }
        break;
      case SurveyStatus.OnConstruction:
        if (currentStatus !== SurveyStatus.OnBudgeting) {
          throw new BadRequestException(
            `Status hanya dapat diubah ke ${targetStatus} jika status saat ini adalah ${SurveyStatus.OnBudgeting}`,
          );
        }
        break;
      case SurveyStatus.Completed:
        if (currentStatus !== SurveyStatus.OnConstruction) {
          throw new BadRequestException(
            `Status hanya dapat diubah ke ${targetStatus} jika status saat ini adalah ${SurveyStatus.OnConstruction}`,
          );
        }
        break;
      default:
        throw new BadRequestException(
          `Perubahan ke status ${targetStatus} tidak dapat dilakukan`,
        );
    }

    return this.surveyRepository.update(id, {
      surveyStatus: dto.surveyStatus,
      ...(dto.sourceOfBudgetting !== undefined
        ? { sourceOfBudgetting: dto.sourceOfBudgetting }
        : {}),
    });
  }

  async remove(id: number) {
    const survey = await this.findOne(id);
    if (survey.surveyStatus !== SurveyStatus.Pending) {
      throw new BadRequestException(
        `Hanya survei dengan status ${SurveyStatus.Pending} yang dapat dihapus`,
      );
    }
    return this.surveyRepository.delete(id);
  }

  private async validateForeignEntities(params: {
    surveyorId?: number;
    provinceId?: string;
    regencyId?: string;
    districtId?: string;
    villageId?: string;
  }) {
    const validations: Promise<void>[] = [];

    if (params.surveyorId !== undefined) {
      validations.push(
        (async () => {
          const surveyor = await this.prisma.userSurveyor.findUnique({
            where: { surveyorId: params.surveyorId },
            select: { surveyorId: true, provinceId: true, regencyId: true },
          });
          if (!surveyor) {
            throw new NotFoundException(`Surveyor tidak ditemukan`);
          }
          if (
            surveyor.provinceId !== params.provinceId ||
            surveyor.regencyId !== params.regencyId
          ) {
            throw new BadRequestException(
              'Provinsi dan kabupaten/kota survei harus sesuai dengan wilayah tugas surveyor',
            );
          }
        })(),
      );
    }

    if (params.provinceId) {
      validations.push(
        (async () => {
          const province = await this.prisma.masterAreaProvince.findUnique({
            where: { id: params.provinceId },
            select: { id: true },
          });
          if (!province) {
            throw new NotFoundException(`Provinsi tidak ditemukan`);
          }
        })(),
      );
    }

    if (params.regencyId) {
      validations.push(
        (async () => {
          const regency = await this.prisma.masterAreaRegency.findUnique({
            where: { id: params.regencyId },
            select: { id: true },
          });
          if (!regency) {
            throw new NotFoundException(`Kabupaten/Kota tidak ditemukan`);
          }
        })(),
      );
    }

    if (params.districtId) {
      validations.push(
        (async () => {
          const district = await this.prisma.masterAreaDistrict.findUnique({
            where: { id: params.districtId },
            select: { id: true },
          });
          if (!district) {
            throw new NotFoundException(`Kecamatan tidak ditemukan`);
          }
        })(),
      );
    }

    if (params.villageId) {
      validations.push(
        (async () => {
          const village = await this.prisma.masterAreaVillage.findUnique({
            where: { id: params.villageId },
            select: { id: true },
          });
          if (!village) {
            throw new NotFoundException(`Kelurahan/Desa tidak ditemukan`);
          }
        })(),
      );
    }

    await Promise.all(validations);
  }

  private async validateUniqueHousingAssessmentParts(
    housingDetails?: Array<{
      housingDamageAssessmentId?: number;
      housingAssessmentPartId?: number;
    }>,
  ) {
    if (!housingDetails || housingDetails.length === 0) return;

    const partIds: number[] = [];

    for (const item of housingDetails) {
      if (item.housingAssessmentPartId) {
        partIds.push(item.housingAssessmentPartId);
      } else if (item.housingDamageAssessmentId) {
        const damageAssessment =
          await this.prisma.housingDamageAssessment.findUnique({
            where: {
              housingDamageAssessmentId: item.housingDamageAssessmentId,
            },
            select: { housingAssessmentPartId: true },
          });
        if (damageAssessment?.housingAssessmentPartId) {
          partIds.push(damageAssessment.housingAssessmentPartId);
        }
      }
    }

    const uniquePartIds = new Set(partIds);
    if (uniquePartIds.size !== partIds.length) {
      throw new BadRequestException(
        'Setiap bagian rumah hanya boleh dinilai maksimal 1 kali dalam tiap survei.',
      );
    }
  }
}
