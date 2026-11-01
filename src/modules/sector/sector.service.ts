import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SectorRepository } from './repositories/sector.repository.js';
import { CreateSectorDto } from './dto/create-sector.dto.js';
import { UpdateSectorDto } from './dto/update-sector.dto.js';
import { QuerySectorDto } from './dto/query-sector.dto.js';
import { ActivityHistoryService } from '../activityHistory/activity-history.service.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';

@Injectable()
export class SectorService {
  constructor(
    private readonly sectorRepository: SectorRepository,
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  async create(createSectorDto: CreateSectorDto, user: JwtPayload) {
    if (createSectorDto.parentId) {
      await this.validateParent(createSectorDto.parentId);
    }

    const created = await this.sectorRepository.create(createSectorDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      relationId: created.sectorId,
      module: 'Master Data - Sector',
      activity: 'Created sector',
    });

    return created;
  }

  async findAll(query: QuerySectorDto) {
    return this.sectorRepository.findAll(query);
  }

  async findOne(id: number) {
    const sector = await this.sectorRepository.findById(id);

    if (!sector) {
      throw new NotFoundException(`Sector with ID ${id} not found`);
    }

    return sector;
  }

  async update(
    id: number,
    updateSectorDto: UpdateSectorDto,
    user: JwtPayload,
  ) {
    await this.findOne(id);

    if (updateSectorDto.parentId) {
      await this.validateParent(updateSectorDto.parentId, id);
    }

    const updated = await this.sectorRepository.update(id, updateSectorDto);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      relationId: id,
      module: 'Master Data - Sector',
      activity: 'Updated sector',
    });

    return updated;
  }

  async remove(id: number, user: JwtPayload) {
    await this.findOne(id);

    const deleted = await this.sectorRepository.delete(id);

    await this.activityHistoryService.record({
      idAdmin: user.sub,
      relationId: id,
      module: 'Master Data - Sector',
      activity: 'Deleted sector',
    });

    return deleted;
  }

  private async validateParent(parentId: number, currentSectorId?: number) {
    if (currentSectorId && parentId === currentSectorId) {
      throw new BadRequestException('A sector cannot be its own parent');
    }

    const parent = await this.findOne(parentId);
    if (parent.parentId !== null) {
      throw new BadRequestException(
        'The selected parent sector must be a primary top-level category and cannot belong to a sub-category.',
      );
    }
  }
}
