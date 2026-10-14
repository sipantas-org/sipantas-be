import { Injectable, NotFoundException } from '@nestjs/common';
import { SurveyRepository } from './repositories/survey.repository.js';
import { CreateSurveyDto } from './dto/create-survey.dto.js';
import { UpdateSurveyDto } from './dto/update-survey.dto.js';
import type { Prisma } from '../../generated/prisma/client.js';
import type { SurveyStatus } from '../../generated/prisma/enums.js';
import { DamageLevel } from '../../generated/prisma/enums.js';

@Injectable()
export class SurveyService {
  constructor(private readonly surveyRepository: SurveyRepository) {}

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

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: SurveyStatus;
    disasterId?: number;
  }) {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.max(Number(params.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const where: Prisma.SurveyWhereInput = {};
    if (params.status) where.surveyStatus = params.status;
    if (params.disasterId) where.disasterId = Number(params.disasterId);

    const [data, total] = await this.surveyRepository.findPage({
      skip,
      take: limit,
      where,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const survey = await this.surveyRepository.findById(id);
    if (!survey) {
      throw new NotFoundException(`Survey with ID ${id} not found`);
    }
    return survey;
  }

  async update(id: number, dto: UpdateSurveyDto) {
    await this.findOne(id);

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

  async remove(id: number) {
    await this.findOne(id);
    return this.surveyRepository.delete(id);
  }
}
