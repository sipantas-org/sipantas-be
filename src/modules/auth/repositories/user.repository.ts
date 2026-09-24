import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { User } from '../domain/user.entity.js';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
