import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client.js';
import { ActivityHistoryRepository } from './repositories/activity-history.repository.js';

export interface RecordActivityInput {
  idUser?: number | null;
  idAdmin?: number | null;
  relationId?: number | null;
  module: string;
  activity: string;
}

@Injectable()
export class ActivityHistoryService {
  constructor(private readonly repository: ActivityHistoryRepository) {}

  async record(
    input: RecordActivityInput,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    await this.repository.create(
      {
        ID_User: input.idUser ?? null,
        ID_Admin: input.idAdmin ?? null,
        Relation_ID: input.relationId ?? null,
        Module: input.module,
        Activity: input.activity,
      },
      tx,
    );
  }
}
