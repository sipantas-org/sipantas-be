import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { MasterAreaProvinceRepository } from './repositories/master-area-province.repository.js';
import { CreateProvinceDto } from './dto/create-province.dto.js';
import { UpdateProvinceDto } from './dto/update-province.dto.js';
import { QueryProvinceDto } from './dto/query-province.dto.js';

@Injectable()
export class MasterAreaProvinceService {
  constructor(private readonly repository: MasterAreaProvinceRepository) {}

  async create(createDto: CreateProvinceDto) {
    const existing = await this.repository.findById(createDto.id);
    if (existing) {
      throw new ConflictException(
        `Province with ID '${createDto.id}' already exists.`,
      );
    }
    return this.repository.create(createDto);
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

  async update(id: string, updateDto: UpdateProvinceDto) {
    await this.findOne(id);
    return this.repository.update(id, updateDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
