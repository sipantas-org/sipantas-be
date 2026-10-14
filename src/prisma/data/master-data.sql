-- ==========================================
-- DUMMY DATA: MASTER DATA SIPANTAS
-- ==========================================

-- 1. SECTOR (Induk dan Sub-Sektor)
INSERT INTO "Sector" ("sectorId", "parentId", "sectorName", "description", "status", "createdAt", "updatedAt")
VALUES
  -- Sektor Utama (Parent)
  (1, NULL, 'Sektor Perumahan dan Permukiman', 'Sektor yang mencakup rumah tinggal, prasarana, dan lingkungan perumahan', 'Active', NOW(), NOW()),
  (2, NULL, 'Sektor Infrastruktur', 'Sektor prasarana fisik dasar publik seperti jalan, jembatan, dan air bersih', 'Active', NOW(), NOW()),
  (3, NULL, 'Sektor Ekonomi Produktif', 'Sektor kegiatan ekonomi masyarakat seperti pertanian, perikanan, dan perdagangan', 'Active', NOW(), NOW()),
  (4, NULL, 'Sektor Sosial', 'Sektor fasilitas umum sosial mencakup sarana pendidikan, kesehatan, dan ibadah', 'Active', NOW(), NOW()),
  (5, NULL, 'Lintas Sektor', 'Sektor tata kelola pemerintahan, lingkungan hidup, dan layanan keuangan', 'Active', NOW(), NOW()),
  
  -- Sub-Sektor (Child)
  (6, 1, 'Perumahan Rakyat', 'Rumah tinggal permanen, semi-permanen, dan non-permanen milik warga', 'Active', NOW(), NOW()),
  (7, 1, 'Prasarana Lingkungan', 'Jalan lingkungan permukiman, drainase lokal, dan MCK komunal', 'Active', NOW(), NOW()),
  (8, 2, 'Transportasi Darat (Jalan & Jembatan)', 'Jalan kabupaten/provinsi dan jembatan penghubung antar-wilayah', 'Active', NOW(), NOW()),
  (9, 2, 'Air Minum dan Sanitasi', 'Jaringan pipa transmisi, sumur gali, dan instalasi pengolahan air minum', 'Active', NOW(), NOW()),
  (10, 2, 'Energi dan Ketenagalistrikan', 'Jaringan tiang listrik tegangan menengah/rendah dan gardu trafo', 'Active', NOW(), NOW()),
  (11, 3, 'Pertanian dan Perkebunan', 'Lahan sawah irigasi, tanaman pangan, dan perkebunan rakyat', 'Active', NOW(), NOW()),
  (12, 3, 'Perikanan dan Kelautan', 'Kolam budidaya ikan, tambak, perahu nelayan, dan tempat pelelangan', 'Active', NOW(), NOW()),
  (13, 3, 'Perdagangan dan Pasar', 'Pasar tradisional, kios kelontong, dan pertokoan UMKM', 'Active', NOW(), NOW()),
  (14, 4, 'Fasilitas Pendidikan', 'Gedung sekolah SD/SMP/SMA, madrasah, dan pondok pesantren', 'Active', NOW(), NOW()),
  (15, 4, 'Fasilitas Kesehatan', 'Puskesmas, puskesmas pembantu (Pustu), posyandu, dan klinik desa', 'Active', NOW(), NOW()),
  (16, 4, 'Tempat Ibadah', 'Masjid, mushola, gereja, dan sarana ibadah lainnya', 'Active', NOW(), NOW()),
  (17, 5, 'Pemerintahan dan Pelayanan Publik', 'Kantor desa/kelurahan, kantor kecamatan, dan balai pertemuan desa', 'Active', NOW(), NOW())
ON CONFLICT ("sectorId") DO UPDATE 
SET "sectorName" = EXCLUDED."sectorName",
    "description" = EXCLUDED."description",
    "status" = EXCLUDED."status",
    "updatedAt" = NOW();

-- 2. HOUSING ASSESSMENT PART (Komponen Rumah yang Dinilai)
INSERT INTO "HousingAssessmentPart" ("housingAssessmentPartId", "partName", "partStatus", "createdAt", "updatedAt")
VALUES
  (1, 'Pondasi', 'Active', NOW(), NOW()),
  (2, 'Struktur (Kolom dan Balok)', 'Active', NOW(), NOW()),
  (3, 'Dinding Pengisi', 'Active', NOW(), NOW()),
  (4, 'Rangka Atap (Kuda-Kuda dan Gording)', 'Active', NOW(), NOW()),
  (5, 'Penutup Atap', 'Active', NOW(), NOW()),
  (6, 'Lantai', 'Active', NOW(), NOW()),
  (7, 'Pintu, Jendela, dan Ventilasi', 'Active', NOW(), NOW())
ON CONFLICT ("housingAssessmentPartId") DO UPDATE 
SET "partName" = EXCLUDED."partName",
    "partStatus" = EXCLUDED."partStatus",
    "updatedAt" = NOW();

-- 3. HOUSING DAMAGE ASSESSMENT (Parameter & Pertanyaan Kerusakan Perumahan)
INSERT INTO "HousingDamageAssessment" ("housingDamageAssessmentId", "housingAssessmentPartId", "surveyDamageQuestion", "surveyScoring", "housingDamageAssessmentStatus", "createdAt", "updatedAt")
VALUES
  (1, 1, 'Apakah pondasi bangunan mengalami keretakan struktural, amblas, atau pergeseran posisi tanah?', '[{"total": 10, "score": 10}, {"total": 10, "score": 6}, {"total": 10, "score": 3}]'::jsonb, 'Active', NOW(), NOW()),
  (2, 2, 'Bagaimana kondisi fisik kolom utama dan balok penopang struktur bangunan?', '[{"total": 15, "score": 15}, {"total": 15, "score": 8}, {"total": 15, "score": 4}]'::jsonb, 'Active', NOW(), NOW()),
  (3, 3, 'Apakah dinding pengisi mengalami keretakan tembus, miring, atau roboh sebagian?', '[{"total": 15, "score": 15}, {"total": 15, "score": 9}, {"total": 15, "score": 3}]'::jsonb, 'Active', NOW(), NOW()),
  (4, 4, 'Apakah struktur rangka atap / kuda-kuda kayu/baja ringan patah atau lepas dari tumpuannya?', '[{"total": 15, "score": 15}, {"total": 15, "score": 8}, {"total": 15, "score": 4}]'::jsonb, 'Active', NOW(), NOW()),
  (5, 5, 'Berapa persen penutup atap (genteng, asbes, seng) yang terlepas atau hancur?', '[{"total": 10, "score": 10}, {"total": 10, "score": 5}, {"total": 10, "score": 2}]'::jsonb, 'Active', NOW(), NOW()),
  (6, 6, 'Apakah permukaan lantai retak parah, amblas, atau tertutup material sedimentasi tebal?', '[{"total": 10, "score": 10}, {"total": 10, "score": 6}, {"total": 10, "score": 2}]'::jsonb, 'Active', NOW(), NOW()),
  (7, 7, 'Bagaimana kondisi fungsional daun pintu, jendela, dan kusen penutup akses ruangan?', '[{"total": 10, "score": 10}, {"total": 10, "score": 5}, {"total": 10, "score": 2}]'::jsonb, 'Active', NOW(), NOW())
ON CONFLICT ("housingDamageAssessmentId") DO UPDATE 
SET "surveyDamageQuestion" = EXCLUDED."surveyDamageQuestion",
    "surveyScoring" = EXCLUDED."surveyScoring",
    "housingDamageAssessmentStatus" = EXCLUDED."housingDamageAssessmentStatus",
    "updatedAt" = NOW();

-- 4. LOSS ASSESSMENT (Parameter Penilaian Kerugian Dampak Bencana)
INSERT INTO "LossAssessment" ("lossAssessmentId", "typeOfLoss", "surveyLossQuestion", "lossAssessmentStatus", "createdAt", "updatedAt")
VALUES
  (1, 'additional_cost', 'Berapa perkiraan biaya pengeluaran tambahan untuk sewa hunian sementara bagi keluarga korban?', 'Active', NOW(), NOW()),
  (2, 'additional_cost', 'Berapa estimasi biaya operasional pembersihan material lumpur, puing-puing, dan sanitasi darurat?', 'Active', NOW(), NOW()),
  (3, 'additional_cost', 'Berapa biaya pengadaan suplai air bersih, penerangan darurat/genset selama masa tanggap darurat?', 'Active', NOW(), NOW()),
  (4, 'income_lost', 'Berapa taksiran hilangnya potensi pendapatan harian usaha UMKM / perdagangan selama lokasi belum beroperasi?', 'Active', NOW(), NOW()),
  (5, 'income_lost', 'Berapa estimasi nilai kerugian ekonomi atas gagal panen lahan pertanian / tambak perikanan?', 'Active', NOW(), NOW())
ON CONFLICT ("lossAssessmentId") DO UPDATE 
SET "typeOfLoss" = EXCLUDED."typeOfLoss",
    "surveyLossQuestion" = EXCLUDED."surveyLossQuestion",
    "lossAssessmentStatus" = EXCLUDED."lossAssessmentStatus",
    "updatedAt" = NOW();

-- 5. DISASTER (Data Master Kejadian Bencana)
INSERT INTO "Disaster" (
  "disasterId", "disasterCode", "disasterName", "disasterCategory", 
  "description", "Status", "provinceId", "regencyId", "createdAt", "updatedAt"
)
VALUES
  (1, 'DIS-2024-CJR-001', 'Gempa Bumi Tektonik Cianjur', 'Gempa Bumi', 
   'Gempa bumi dangkal M 5.6 yang memicu kerusakan permukiman dan tanah longsor di beberapa kecamatan.', 'Completed', NULL, NULL, NOW(), NOW()),
  
  (2, 'DIS-2024-SKB-002', 'Banjir Bandang Cicurug Sukabumi', 'Banjir Bandang', 
   'Luapan air sungai akibat curah hujan ekstrem merusak jembatan antardesa dan puluhan rumah warga.', 'On Budgeting', NULL, NULL, NOW(), NOW()),
  
  (3, 'DIS-2024-BGR-003', 'Tanah Longsor Perbukitan Puncak', 'Tanah Longsor', 
   'Pergerakan tanah pada tebing lereng curam yang menimbun akses jalan utama dan fasilitas publik.', 'Active', NULL, NULL, NOW(), NOW()),
  
  (4, 'DIS-2024-BDG-004', 'Angin Puting Beliung Rancaekek', 'Angin Puting Beliung', 
   'Pusaran angin kencang merusak struktur rangka atap bangunan industri, fasilitas umum, dan permukiman padat.', 'Active', NULL, NULL, NOW(), NOW()),
  
  (5, 'DIS-2024-LBG-005', 'Kekeringan dan Krisis Air Bersih', 'Kekeringan', 
   'Kekeringan berkepanjangan pada sektor pertanian pangan dan sumber mata air baku masyarakat desa.', 'Active', NULL, NULL, NOW(), NOW())
ON CONFLICT ("disasterCode") DO UPDATE 
SET "disasterName" = EXCLUDED."disasterName",
    "disasterCategory" = EXCLUDED."disasterCategory",
    "description" = EXCLUDED."description",
    "Status" = EXCLUDED."Status",
    "updatedAt" = NOW();

-- ==========================================
-- SYNCHRONIZE POSTGRESQL SEQUENCES
-- ==========================================
SELECT setval(pg_get_serial_sequence('"Sector"', 'sectorId'), COALESCE(MAX("sectorId"), 1)) FROM "Sector";
SELECT setval(pg_get_serial_sequence('"HousingAssessmentPart"', 'housingAssessmentPartId'), COALESCE(MAX("housingAssessmentPartId"), 1)) FROM "HousingAssessmentPart";
SELECT setval(pg_get_serial_sequence('"HousingDamageAssessment"', 'housingDamageAssessmentId'), COALESCE(MAX("housingDamageAssessmentId"), 1)) FROM "HousingDamageAssessment";
SELECT setval(pg_get_serial_sequence('"LossAssessment"', 'lossAssessmentId'), COALESCE(MAX("lossAssessmentId"), 1)) FROM "LossAssessment";
SELECT setval(pg_get_serial_sequence('"Disaster"', 'disasterId'), COALESCE(MAX("disasterId"), 1)) FROM "Disaster";