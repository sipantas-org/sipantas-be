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
          surveyorId: params.idSurveyor,
          adminId: params.idAdmin,
          statusApproval: params.status,
          Description: params.description ?? null,
          approvalDate: new Date(),
        },
      });
      await client.userSurveyor.update({
        where: { surveyorId: params.idSurveyor },
        data: { status: surveyorStatus },
      });
      return approval;
    };

    if (tx) {
      return run(tx);
    }
    return this.prisma.$transaction((innerTx) => run(innerTx));
  }
}
