import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MasterAreaRegencyRepository } from './repositories/master-area-regency.repository.js';
import { CreateRegencyDto } from './dto/create-regency.dto.js';
import { UpdateRegencyDto } from './dto/update-regency.dto.js';
import { QueryRegencyDto } from './dto/query-regency.dto.js';
import { ActivityHistoryService } from '../activityHistory/activity-history.service.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';

@Injectable()
export class MasterAreaRegencyService {
  constructor(
    private readonly repository: MasterAreaRegencyRepository,
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  async create(createDto: CreateRegencyDto, user: JwtPayload) {
    const existingRegency = await this.repository.findById(createDto.id);
    if (existingRegency) {
      throw new ConflictException(
        `Regency with ID '${createDto.id}' already exists.`,
      );
    }

    const provinceExists = await this.repository.existsProvince(
      createDto.provinceId,
    );
    if (!provinceExists) {
      throw new BadRequestException(
        `Province with ID '${createDto.provinceId}' does not exist.`,
      );
    }

    const created = await this.repository.create(createDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - Regency',
      activity: `Created regency '${createDto.id}'`,
    });

    return created;
  }

  async findAll(query: QueryRegencyDto) {
    return this.repository.findAll(query);
  }

  async findOne(id: string) {
    const regency = await this.repository.findById(id);
    if (!regency) {
      throw new NotFoundException(`Regency with ID '${id}' not found.`);
    }
    return regency;
  }

  async update(id: string, updateDto: UpdateRegencyDto, user: JwtPayload) {
    await this.findOne(id); // Throws 404 if regency not found
    const updated = await this.repository.update(id, updateDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - Regency',
      activity: `Updated regency '${id}'`,
    });

    return updated;
  }

  async remove(id: string, user: JwtPayload) {
    await this.findOne(id); // Throws 404 if regency not found
    const deleted = await this.repository.delete(id);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - Regency',
      activity: `Deleted regency '${id}'`,
    });

    return deleted;
  }
}
