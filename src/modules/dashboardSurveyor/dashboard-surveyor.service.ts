import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DamageLevel, SurveyStatus } from '../../generated/prisma/enums.js';

@Injectable()
export class DashboardSurveyorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mengambil distribusi tingkat kerusakan bangunan berdasarkan surveyor yang sedang login
   */
  async getDamageDistribution(
    surveyorId: number,
  ): Promise<Array<{ level: string; count: number; percentage: number }>> {
    try {
      const grouped = await this.prisma.survey.groupBy({
        by: ['damageLevel'],
        where: {
          surveyorId,
        },
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
        'Gagal mengambil distribusi kerusakan survei surveyor',
      );
    }
  }

  /**
   * Mengambil statistik status survei berdasarkan surveyor yang sedang login
   */
  async getSurveyStatusSummary(
    surveyorId: number,
  ): Promise<Array<{ key: string; label: string; count: number }>> {
    try {
      const grouped = await this.prisma.survey.groupBy({
        by: ['surveyStatus'],
        where: {
          surveyorId,
        },
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
        'Gagal mengambil ringkasan status survei surveyor',
      );
    }
  }
}
