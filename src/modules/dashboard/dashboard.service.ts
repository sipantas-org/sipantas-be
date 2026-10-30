import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DamageLevel, SurveyStatus } from '../../generated/prisma/enums.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. GET /dashboard/surveys/status-summary
   */
  async getSurveyStatusSummary(): Promise<
    Array<{ key: string; label: string; count: number }>
  > {
    try {
      const grouped = await this.prisma.survey.groupBy({
        by: ['surveyStatus'],
        _count: {
          surveyId: true,
        },
      });

      const countMap = new Map<SurveyStatus, number>();
      grouped.forEach((item) => {
        countMap.set(item.surveyStatus, item._count.surveyId);
      });

      const statuses = [
        { key: SurveyStatus.Pending, label: 'Pending' },
        { key: SurveyStatus.OnVerification, label: 'Verifikasi' },
        { key: SurveyStatus.OnBudgeting, label: 'Penganggaran' },
        { key: SurveyStatus.Completed, label: 'Selesai' },
      ];

      return statuses.map((status) => {
        let count = countMap.get(status.key) ?? 0;
        if (status.key === SurveyStatus.OnVerification) {
          count += countMap.get(SurveyStatus.OnComplain) ?? 0;
        }

        return {
          key: status.key,
          label: status.label,
          count,
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil ringkasan status survei',
      );
    }
  }

  /**
   * 2. GET /dashboard/surveyors/approval-summary
   */
  async getSurveyorApprovalSummary(): Promise<{
    pending: number;
    approved: number;
    rejected: number;
  }> {
    try {
      const grouped = await this.prisma.userSurveyor.groupBy({
        by: ['status'],
        _count: {
          surveyorId: true,
        },
      });

      let pending = 0;
      let approved = 0;
      let rejected = 0;

      grouped.forEach((item) => {
        const statusStr = String(item.status).toLowerCase();
        if (statusStr === 'pending') {
          pending += item._count.surveyorId;
        } else if (statusStr === 'active' || statusStr === 'approved') {
          approved += item._count.surveyorId;
        } else if (statusStr === 'rejected') {
          rejected += item._count.surveyorId;
        }
      });

      return { pending, approved, rejected };
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil ringkasan persetujuan surveyor',
      );
    }
  }

  /**
   * 3. GET /dashboard/disasters/summary
   */
  async getDisasterSummary(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    try {
      const [total, active, inactive] = await Promise.all([
        this.prisma.disaster.count(),
        this.prisma.disaster.count({
          where: {
            disasterStatus: {
              equals: 'Active',
            },
          },
        }),
        this.prisma.disaster.count({
          where: {
            disasterStatus: {
              in: ['Inactive'],
            },
          },
        }),
      ]);

      return { total, active, inactive };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Gagal mengambil ringkasan bencana',
      );
    }
  }

  /**
   * 4. GET /dashboard/surveys/damage-distribution
   */
  async getDamageDistribution(): Promise<
    Array<{ level: string; count: number; percentage: number }>
  > {
    try {
      const grouped = await this.prisma.survey.groupBy({
        by: ['damageLevel'],
        _count: {
          surveyId: true,
        },
      });

      const countMap = new Map<DamageLevel, number>();
      let totalSurveys = 0;

      grouped.forEach((item) => {
        countMap.set(item.damageLevel, item._count.surveyId);
        totalSurveys += item._count.surveyId;
      });

      const damageMapping = [
        { level: 'Rusak Berat', enumKey: DamageLevel.Berat },
        { level: 'Rusak Sedang', enumKey: DamageLevel.Sedang },
        { level: 'Rusak Ringan', enumKey: DamageLevel.Ringan },
        { level: 'TMK (Tidak Memenuhi Kriteria)', enumKey: DamageLevel.TMK },
      ];

      return damageMapping.map((dm) => {
        const count = countMap.get(dm.enumKey) ?? 0;
        const percentage =
          totalSurveys > 0
            ? Number(((count / totalSurveys) * 100).toFixed(1))
            : 0;

        return {
          level: dm.level,
          count,
          percentage,
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil distribusi kerusakan survei',
      );
    }
  }

  /**
   * 5. GET /dashboard/trends/monthly
   * Mengambil tren survei dan kerugian finansial selama N bulan terakhir (default: 12 bulan)
   */
  async getMonthlyTrends(
    months = 12,
  ): Promise<
    Array<{ month: string; survey_count: number; total_loss: number }>
  > {
    try {
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des',
      ];

      const now = new Date();
      // Awal bulan untuk (months - 1) bulan yang lalu pada pukul 00:00:00
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth() - (months - 1),
        1,
        0,
        0,
        0,
        0,
      );

      const rows = await this.prisma.$queryRaw<
        Array<{
          year_month: string;
          survey_count: bigint | number;
          total_loss: bigint | number | null;
        }>
      >`
        SELECT 
          TO_CHAR("createdAt", 'YYYY-MM') AS year_month,
          COUNT("surveyId")::INTEGER AS survey_count,
          COALESCE(SUM("totalPriceUnit" + "totalPriceFurniture"), 0)::BIGINT AS total_loss
        FROM "Survey"
        WHERE "createdAt" >= ${startDate}
        GROUP BY year_month
        ORDER BY year_month ASC;
      `;

      const dataMap = new Map<string, { count: number; loss: number }>();
      rows.forEach((row) => {
        dataMap.set(row.year_month, {
          count: Number(row.survey_count),
          loss: Number(row.total_loss ?? 0),
        });
      });

      const result: Array<{
        month: string;
        survey_count: number;
        total_loss: number;
      }> = [];

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const found = dataMap.get(key);
        result.push({
          month: monthNames[d.getMonth()],
          survey_count: found?.count ?? 0,
          total_loss: found?.loss ?? 0,
        });
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil tren bulanan survei dan kerugian',
      );
    }
  }

  /**
   * 6. GET /dashboard/disasters/survey-distribution
   */
  async getDisasterSurveyDistribution(
    limit: number,
  ): Promise<Array<{ disaster_code: string; name: string; count: number }>> {
    try {
      const result = await this.prisma.$queryRaw<
        Array<{ disaster_code: string; name: string; count: bigint | number }>
      >`
        SELECT 
          d."disasterCode" AS disaster_code,
          d."disasterName" AS name,
          COUNT(s."surveyId")::INTEGER AS count
        FROM "Disaster" d
        LEFT JOIN "Survey" s ON d."disasterId" = s."disasterId"
        GROUP BY d."disasterId", d."disasterCode", d."disasterName"
        ORDER BY count DESC
        LIMIT ${limit};
      `;

      return result.map((item) => ({
        disaster_code: item.disaster_code,
        name: item.name,
        count: Number(item.count),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil distribusi survei per bencana',
      );
    }
  }
}
