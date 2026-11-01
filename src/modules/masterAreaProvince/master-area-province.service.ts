import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { MasterAreaProvinceRepository } from './repositories/master-area-province.repository.js';
import { CreateProvinceDto } from './dto/create-province.dto.js';
import { UpdateProvinceDto } from './dto/update-province.dto.js';
import { QueryProvinceDto } from './dto/query-province.dto.js';
import { ActivityHistoryService } from '../activityHistory/activity-history.service.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';

@Injectable()
export class MasterAreaProvinceService {
  constructor(
    private readonly repository: MasterAreaProvinceRepository,
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  async create(createDto: CreateProvinceDto, user: JwtPayload) {
    const existing = await this.repository.findById(createDto.id);
    if (existing) {
      throw new ConflictException(
        `Province with ID '${createDto.id}' already exists.`,
      );
    }
    const created = await this.repository.create(createDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - Province',
      activity: `Created province '${createDto.id}'`,
    });

    return created;
  }

  async findAll(query: QueryProvinceDto) {
    return this.repository.findAll(query);
  }

  async findOne(id: string) {
    const province = await this.repository.findById(id);
    if (!province) {
      throw new NotFoundException(`Province with ID '${id}' not found.`);
    }
    return province;
  }

  async update(id: string, updateDto: UpdateProvinceDto, user: JwtPayload) {
    await this.findOne(id);
    const updated = await this.repository.update(id, updateDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - Province',
      activity: `Updated province '${id}'`,
    });

    return updated;
  }

  async remove(id: string, user: JwtPayload) {
    await this.findOne(id);
    const deleted = await this.repository.delete(id);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      module: 'Master Area - Province',
      activity: `Deleted province '${id}'`,
    });

    return deleted;
  }
}
