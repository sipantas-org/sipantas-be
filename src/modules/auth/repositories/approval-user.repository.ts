import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import {
  ApprovalStatus,
  SurveyorStatus,
} from '../../../generated/prisma/enums.js';
import type { ApprovalUser } from '../entities/auth.entity.js';

@Injectable()
export class ApprovalUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async decide(
    params: {
      idSurveyor: number;
      idAdmin: number;
      status: 'Approved' | 'Rejected';
      description?: string;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<ApprovalUser> {
    const surveyorStatus =
      params.status === ApprovalStatus.Approved
        ? SurveyorStatus.Active
        : SurveyorStatus.Rejected;

    const run = async (client: Prisma.TransactionClient) => {
      const approval = await client.approvalUser.create({
        data: {
          ID_Surveyor: params.idSurveyor,
          ID_Admin: params.idAdmin,
          Status_Approval: params.status,
          Description: params.description ?? null,
          Approval_Date: new Date(),
        },
      });
      await client.userSurveyor.update({
        where: { ID_Surveyor: params.idSurveyor },
        data: { Status: surveyorStatus },
      });
      return approval;
    };

    if (tx) {
      return run(tx);
    }
    return this.prisma.$transaction((innerTx) => run(innerTx));
  }
}
