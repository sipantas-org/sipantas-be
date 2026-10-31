import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ComplainService } from './complain.service.js';
import { ComplainRepository } from './repositories/complain.repository.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('ComplainService.searchPendingSurveyByNik', () => {
  const baseSurvey = {
    surveyId: 12,
    surveyStatus: 'Pending',
    nik: '3201123456780001',
    assetName: 'Rumah Pak Budi',
    addressDetail: 'Jl. Merdeka No. 10',
    authority: 'KabupatenKota',
    latitude: '-6.2088',
    longitude: '106.8456',
    damageLevel: 'Sedang',
    volume: '150',
    volumeUnit: 'm2',
    disasterId: 3,
    provinceId: '32',
    regencyId: '32.03',
    districtId: '32.03.01',
    villageId: '32.03.01.1001',
    createdAt: new Date('2026-10-22T03:00:00.000Z'),
    province: { id: '32', name: 'Jawa Barat' },
    regency: { id: '32.03', name: 'Kabupaten Cianjur' },
    district: { id: '32.03.01', name: 'Cianjur' },
    village: { id: '32.03.01.1001', name: 'Sukamanah' },
    housingDetails: [
      { housingDamageAssessmentId: 1, totalUnit: 3, score: 15 },
      { housingDamageAssessmentId: 4, totalUnit: 2, score: 11 },
    ],
    fileDetails: [
      {
        category: 'Pondasi/Sloof',
        filePath: 'complains/survey-12/pondasi-sloof',
        fileName: 'foto-1.jpg',
      },
    ],
  };

  async function createService(
    findLatestPendingSurveyByNikImpl: () => unknown,
  ) {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ComplainService,
        {
          provide: ComplainRepository,
          useValue: {
            findLatestPendingSurveyByNik: findLatestPendingSurveyByNikImpl,
          },
        },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    return moduleRef.get(ComplainService);
  }

  it('(a) mengembalikan housingDetails & fileDetails, tanpa surveyor/harga/furnitureDetails/lostDetails', async () => {
    const service = await createService(() => Promise.resolve(baseSurvey));

    const result = (await service.searchPendingSurveyByNik(
      '3201123456780001',
    )) as unknown as Record<string, unknown>;

    expect(result.housingDetails).toEqual(baseSurvey.housingDetails);
    expect(result.fileDetails).toEqual(baseSurvey.fileDetails);

    expect(result).not.toHaveProperty('surveyor');
    expect(result).not.toHaveProperty('surveyorId');
    expect(result).not.toHaveProperty('totalPriceUnit');
    expect(result).not.toHaveProperty('totalPriceFurniture');
    expect(result).not.toHaveProperty('totalScore');
    expect(result).not.toHaveProperty('sourceOfBudgetting');
    expect(result).not.toHaveProperty('furnitureDetails');
    expect(result).not.toHaveProperty('lostDetails');
    expect(result).not.toHaveProperty('updatedAt');
  });

  it('(b) melempar 404 dengan pesan tetap saat tidak ada survei Pending untuk NIK tersebut', async () => {
    const service = await createService(() => Promise.resolve(null));

    await expect(
      service.searchPendingSurveyByNik('9999999999999999'),
    ).rejects.toThrow(NotFoundException);

    await expect(
      service.searchPendingSurveyByNik('9999999999999999'),
    ).rejects.toThrow(
      'Tidak ditemukan survei berstatus Pending untuk NIK tersebut.',
    );
  });

  it('(c) mengembalikan survei terbaru saat repository memilihkan beberapa survei Pending (diurutkan createdAt desc)', async () => {
    // Pemilihan "terbaru" dilakukan oleh ComplainRepository lewat
    // `orderBy: { createdAt: 'desc' }` + `findFirst()` terhadap DB — service
    // ini cuma memastikan hasil yang sudah dipilih repository diteruskan
    // apa adanya (surveyId & createdAt-nya tidak diubah/ditimpa service).
    const newestSurvey = {
      ...baseSurvey,
      surveyId: 99,
      createdAt: new Date('2026-10-30T10:00:00.000Z'),
    };

    const service = await createService(() => Promise.resolve(newestSurvey));

    const result = (await service.searchPendingSurveyByNik(
      '3201123456780001',
    )) as unknown as Record<string, unknown>;

    expect(result.surveyId).toBe(99);
  });
});
