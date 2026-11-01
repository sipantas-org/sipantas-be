import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MasterAreaVillageRepository } from './repositories/master-area-village.repository.js';
import { CreateVillageDto } from './dto/create-village.dto.js';
import { UpdateVillageDto } from './dto/update-village.dto.js';
import { QueryVillageDto } from './dto/query-village.dto.js';
import { ActivityHistoryService } from '../activityHistory/activity-history.service.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';

@Injectable()
export class MasterAreaVillageService {
  constructor(
    private readonly repository: MasterAreaVillageRepository,
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  async create(createDto: CreateVillageDto, user: JwtPayload) {
    const existingVillage = await this.repository.findById(createDto.id);
    if (existingVillage) {
      throw new ConflictException(
        `Village with ID '${createDto.id}' already exists.`,
      );
    }

    const districtExists = await this.repository.existsDistrict(
      createDto.districtId,
    );
    if (!districtExists) {
      throw new BadRequestException(
        `District with ID '${createDto.districtId}' does not exist.`,
      );
    }

    const created = await this.repository.create(createDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - Village',
      activity: `Created village '${createDto.id}'`,
    });

    return created;
  }

  async findAll(query: QueryVillageDto) {
    return this.repository.findAll(query);
  }

  async findOne(id: string) {
    const village = await this.repository.findById(id);
    if (!village) {
      throw new NotFoundException(`Village with ID '${id}' not found.`);
    }
    return village;
  }

  async update(id: string, updateDto: UpdateVillageDto, user: JwtPayload) {
    await this.findOne(id); // Throws 404 if village not found
    const updated = await this.repository.update(id, updateDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - Village',
      activity: `Updated village '${id}'`,
    });

    return updated;
  }

  async remove(id: string, user: JwtPayload) {
    await this.findOne(id); // Throws 404 if village not found
    const deleted = await this.repository.delete(id);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - Village',
      activity: `Deleted village '${id}'`,
    });

    return deleted;
  }
}
