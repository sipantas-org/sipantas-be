import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client.js';
import { ActivityHistoryRepository } from './repositories/activity-history.repository.js';

export interface RecordActivityInput {
  /** User (surveyor) this activity concerns, if applicable. */
  idUser?: number | null;
  /** Admin who performed the activity, if applicable. */
  idAdmin?: number | null;
  /** ID of the specific record this activity refers to (e.g. an approval row). */
  relationId?: number | null;
  /** Name of the feature/module the activity belongs to, e.g. "Surveyor Registration". */
  module: string;
  /** Human-readable description of what happened. */
  activity: string;
}

/**
 * Generic activity/audit log, reusable by any module. Pass a Prisma
 * transaction client when the log entry must stay atomic with other writes.
 */
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
