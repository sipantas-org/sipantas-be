import { Injectable, NotFoundException } from '@nestjs/common';
import { HousingAssessmentPartRepository } from './repositories/housing-assessment-part.repository.js';
import { CreateHousingAssessmentPartDto } from './dto/create-housing-assessment-part.dto.js';
import { UpdateHousingAssessmentPartDto } from './dto/update-housing-assessment-part.dto.js';
import { QueryHousingAssessmentPartDto } from './dto/query-housing-assessment-part.dto.js';
import { ActivityHistoryService } from '../activityHistory/activity-history.service.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';

@Injectable()
export class HousingAssessmentPartService {
  constructor(
    private readonly repository: HousingAssessmentPartRepository,
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  async create(createDto: CreateHousingAssessmentPartDto, user: JwtPayload) {
    const created = await this.repository.create(createDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      relationId: created.housingAssessmentPartId,
      module: 'Master Data - Housing Assessment Part',
      activity: 'Created housing assessment part',
    });

    return created;
  }

  async findAll(query: QueryHousingAssessmentPartDto) {
    return this.repository.findAll(query);
  }

  async findOne(id: number) {
    const part = await this.repository.findById(id);

    if (!part) {
      throw new NotFoundException(
        `Housing Assessment Part dengan ID ${id} tidak ditemukan`,
      );
    }

    return part;
  }

  async update(
    id: number,
    updateDto: UpdateHousingAssessmentPartDto,
    user: JwtPayload,
  ) {
    await this.findOne(id); // Pastikan record ada sebelum update
    const updated = await this.repository.update(id, updateDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      relationId: id,
      module: 'Master Data - Housing Assessment Part',
      activity: 'Updated housing assessment part',
    });

    return updated;
  }

  async remove(id: number, user: JwtPayload) {
    await this.findOne(id); // Pastikan record ada sebelum delete
    const deleted = await this.repository.delete(id);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      relationId: id,
      module: 'Master Data - Housing Assessment Part',
      activity: 'Deleted housing assessment part',
    });

    return deleted;
  }
}
