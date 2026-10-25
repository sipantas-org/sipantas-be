import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SectorRepository } from './repositories/sector.repository.js';
import { CreateSectorDto } from './dto/create-sector.dto.js';
import { UpdateSectorDto } from './dto/update-sector.dto.js';
import { QuerySectorDto } from './dto/query-sector.dto.js';

@Injectable()
export class SectorService {
  constructor(private readonly sectorRepository: SectorRepository) {}

  async create(createSectorDto: CreateSectorDto) {
    if (createSectorDto.parentId) {
      await this.validateParent(createSectorDto.parentId);
    }

    return this.sectorRepository.create(createSectorDto);
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

  async update(id: number, updateSectorDto: UpdateSectorDto) {
    await this.findOne(id);

    if (updateSectorDto.parentId) {
      await this.validateParent(updateSectorDto.parentId, id);
    }

    return this.sectorRepository.update(id, updateSectorDto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.sectorRepository.delete(id);
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
