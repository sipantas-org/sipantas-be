import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MasterAreaDistrictRepository } from './repositories/master-area-district.repository.js';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';
import { QueryDistrictDto } from './dto/query-district.dto.js';
import { ActivityHistoryService } from '../activityHistory/activity-history.service.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';

@Injectable()
export class MasterAreaDistrictService {
  constructor(
    private readonly repository: MasterAreaDistrictRepository,
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  async create(createDto: CreateDistrictDto, user: JwtPayload) {
    const existingDistrict = await this.repository.findById(createDto.id);
    if (existingDistrict) {
      throw new ConflictException(
        `District with ID '${createDto.id}' already exists.`,
      );
    }

    const regencyExists = await this.repository.existsRegency(
      createDto.regencyId,
    );
    if (!regencyExists) {
      throw new BadRequestException(
        `Regency with ID '${createDto.regencyId}' does not exist.`,
      );
    }

    const created = await this.repository.create(createDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - District',
      activity: `Created district '${createDto.id}'`,
    });

    return created;
  }

  async findAll(query: QueryDistrictDto) {
    return this.repository.findAll(query);
  }

  async findOne(id: string) {
    const district = await this.repository.findById(id);
    if (!district) {
      throw new NotFoundException(`District with ID '${id}' not found.`);
    }
    return district;
  }

  async update(id: string, updateDto: UpdateDistrictDto, user: JwtPayload) {
    await this.findOne(id); // Throws 404 if district not found
    const updated = await this.repository.update(id, updateDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - District',
      activity: `Updated district '${id}'`,
    });

    return updated;
  }

  async remove(id: string, user: JwtPayload) {
    await this.findOne(id); // Throws 404 if district not found
    const deleted = await this.repository.delete(id);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - District',
      activity: `Deleted district '${id}'`,
    });

    return deleted;
  }
}
