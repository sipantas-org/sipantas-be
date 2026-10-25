import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SurveyRepository } from './repositories/survey.repository.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSurveyDto } from './dto/create-survey.dto.js';
import { UpdateSurveyDto } from './dto/update-survey.dto.js';
import { UpdateSurveyStatusDto } from './dto/update-survey-status.dto.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { DamageLevel, SurveyStatus } from '../../generated/prisma/enums.js';
import { QuerySurveyDto } from './dto/query-survey.dto.js';

@Injectable()
export class SurveyService {
  constructor(
    private readonly surveyRepository: SurveyRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateSurveyDto) {
    const {
      provinceId,
      regencyId,
      districtId,
      villageId,
      volumeUnitOther,
      furnitureDetails,
      housingDetails,
      lostDetails,
      ...rest
    } = dto;

    await this.validateUniqueHousingAssessmentParts(housingDetails);

    const totalHousingScore =
      housingDetails && housingDetails.length > 0
        ? housingDetails.reduce(
            (sum, item) => sum + (Number(item.score) || 0),
            0,
          )
        : null;

    let damage: DamageLevel;
    if (totalHousingScore !== null) {
      if (totalHousingScore > 70) {
        damage = DamageLevel.Berat;
      } else if (totalHousingScore > 30) {
        damage = DamageLevel.Sedang;
      } else if (totalHousingScore >= 20) {
        damage = DamageLevel.Ringan;
      } else {
        damage = DamageLevel.TMK;
      }
    } else {
      damage = DamageLevel.TMK;
    }
    const data: Prisma.SurveyCreateInput = {
      ...rest,
      damageLevel: damage,
      totalScore: totalHousingScore?.toString() ?? '',
      volumeUnitOther: volumeUnitOther ?? '',
      ...(provinceId ? { province: { connect: { id: provinceId } } } : {}),
      ...(regencyId ? { regency: { connect: { id: regencyId } } } : {}),
      ...(districtId ? { district: { connect: { id: districtId } } } : {}),
      ...(villageId ? { village: { connect: { id: villageId } } } : {}),
    };

    return this.surveyRepository.createWithDetails({
      data,
      furnitureDetails,
      housingDetails,
      lostDetails,
    });
  }

  async findAll(query: QuerySurveyDto) {
    const surveys = await this.surveyRepository.findAll(query);
    return surveys;
  }

  async findOne(id: number) {
    const survey = await this.surveyRepository.findById(id);
    if (!survey) {
      throw new NotFoundException(`Survey with ID ${id} not found`);
    }
    return survey;
  }

  async update(id: number, dto: UpdateSurveyDto) {
    const survey = await this.findOne(id);
    if (survey.surveyStatus !== SurveyStatus.Pending) {
      throw new BadRequestException(
        `Hanya survei dengan status ${SurveyStatus.Pending} yang dapat diupdate`,
      );
    }

    const {
      provinceId,
      regencyId,
      districtId,
      villageId,
      volumeUnitOther,
      furnitureDetails,
      housingDetails,
      lostDetails,
      ...rest
    } = dto;

    if (housingDetails !== undefined) {
      await this.validateUniqueHousingAssessmentParts(housingDetails);
    }

    const data: Prisma.SurveyUpdateInput = {
      ...rest,
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
    return this.surveyRepository.updateWithDetails(id, {
      data,
      furnitureDetails,
      housingDetails,
      lostDetails,
    });
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
      case SurveyStatus.OnComplain:
      case SurveyStatus.OnBudgeting:
        if (currentStatus !== SurveyStatus.Pending) {
          throw new BadRequestException(
            `Status hanya dapat diubah ke ${targetStatus} jika status saat ini adalah ${SurveyStatus.Pending}`,
          );
        }
        break;
      case SurveyStatus.Pending:
        if (currentStatus !== SurveyStatus.OnComplain) {
          throw new BadRequestException(
            `Status hanya dapat diubah ke ${SurveyStatus.Pending} jika status saat ini adalah ${SurveyStatus.OnComplain}`,
          );
        }
        break;
      case SurveyStatus.OnConstruction:
        if (currentStatus !== SurveyStatus.OnBudgeting) {
          throw new BadRequestException(
            `Status hanya dapat diubah ke ${SurveyStatus.OnConstruction} jika status saat ini adalah ${SurveyStatus.OnBudgeting}`,
          );
        }
        break;
      case SurveyStatus.Completed:
        if (currentStatus !== SurveyStatus.OnConstruction) {
          throw new BadRequestException(
            `Status hanya dapat diubah ke ${SurveyStatus.Completed} jika status saat ini adalah ${SurveyStatus.OnConstruction}`,
          );
        }
        break;
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
