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
INSERT INTO "HousingAssessmentPart" (
    "housingAssessmentPartId", 
    "partName", 
    "partStatus", 
    "createdAt", 
    "updatedAt"
)
VALUES
    (1, 'Pondasi/Sloof', 'Active', NOW(), NOW()),
    (2, 'Kolom/Balok', 'Active', NOW(), NOW()),
    (3, 'Rangka Atap/Kuda-Kuda', 'Active', NOW(), NOW()),
    (4, 'Penutup Atap', 'Active', NOW(), NOW()),
    (5, 'Dinding', 'Active', NOW(), NOW()),
    (6, 'Lantai', 'Active', NOW(), NOW())
ON CONFLICT ("housingAssessmentPartId") DO UPDATE 
SET "partName" = EXCLUDED."partName",
    "partStatus" = EXCLUDED."partStatus",
    "updatedAt" = NOW();

-- 3. HOUSING DAMAGE ASSESSMENT (Parameter & Pertanyaan Kerusakan Perumahan)
INSERT INTO "HousingDamageAssessment" (
  "housingDamageAssessmentId",
  "housingAssessmentPartId",
  "surveyOrderNumber",
  "surveyDamageQuestion",
  "surveyScoring",
  "housingDamageAssessmentStatus",
  "createdAt",
  "updatedAt"
)
VALUES
  -- 1. Pondasi/Sloof (housingAssessmentPartId: 1)
  (1, 1, '1', 'Retak terlihat jelas pada permukaan beton (lebar retakan kira-kira 1 - 2 mm)', '[{"total": "1", "score": 3}, {"total": "2", "score": 4}, {"total": "≥ 3", "score": 5}]'::jsonb, 'Active', NOW(), NOW()),
  (2, 1, '2', 'Kehancuran beton yang sangat nyata dengan tulangan beton terlihat', '[{"total": "1", "score": 5}, {"total": "2", "score": 8}, {"total": "≥ 3", "score": 11}]'::jsonb, 'Active', NOW(), NOW()),
  (3, 1, '3','Penurunan dan atau Pondasi hancur', '[{"total": "1", "score": 11}, {"total": "2", "score": 14}, {"total": "≥ 3", "score": 15}]'::jsonb, 'Active', NOW(), NOW()),

  -- 2. Kolom/Balok (housingAssessmentPartId: 2)
  (4, 2, '1','Retak rambut terlihat jelas pada permukaan beton (lebar retakan kira-kira 0,2 - 1 mm)', '[{"total": "1", "score": 7}, {"total": "2", "score": 9}, {"total": "≥ 3", "score": 11}]'::jsonb, 'Active', NOW(), NOW()),
  (5, 2, '2','Retakan yang sangat jelas (lebar retakan kira-kira 1 - 2 mm)', '[{"total": "1", "score": 7}, {"total": "2", "score": 9}, {"total": "≥ 3", "score": 11}]'::jsonb, 'Active', NOW(), NOW()),
  (6, 2, '3','Kehancuran beton, tulangan tertekuk dan atau deformasi pada kolom dapat terlihat', '[{"total": "1", "score": 12}, {"total": "2", "score": 26}, {"total": "≥ 3", "score": 35}]'::jsonb, 'Active', NOW(), NOW()),

  -- 3. Rangka Atap/Kuda-Kuda (housingAssessmentPartId: 3)
  (7, 3, '1','Reng dan atau usuk hancur sebagian atau seluruh', '[{"total": "1", "score": 3}, {"total": "2", "score": 5}, {"total": "≥ 3", "score": 11}]'::jsonb, 'Active', NOW(), NOW()),
  (8, 3, '2', 'Kuda-kuda roboh sebagian atau seluruh', '[{"total": "1", "score": 11}, {"total": "2", "score": 14}, {"total": "≥ 3", "score": 15}]'::jsonb, 'Active', NOW(), NOW()),

  -- 4. Penutup Atap (housingAssessmentPartId: 4)
  (9, 4, '1','Berjatuhan menyebar sebagian atau seluruh', '[{"total": "1", "score": 5}, {"total": "≥ 2", "score": 10}]'::jsonb, 'Active', NOW(), NOW()),

  -- 5. Dinding (housingAssessmentPartId: 5)
  (10, 5, '1','Plesteran dan atau terkelupas', '[{"total": "1", "score": 3}, {"total": "2", "score": 4}, {"total": "≥ 3", "score": 5}]'::jsonb, 'Active', NOW(), NOW()),
  (11, 5, '2','Retakan dapat terlihat jelas, tembus pada pasangan batu', '[{"total": "1", "score": 5}, {"total": "2", "score": 8}, {"total": "≥ 3", "score": 11}]'::jsonb, 'Active', NOW(), NOW()),
  (12, 5, '3', 'Dinding jatuh sebagian atau menyeluruh', '[{"total": "1", "score": 11}, {"total": "2", "score": 14}, {"total": "≥ 3", "score": 15}]'::jsonb, 'Active', NOW(), NOW()),

  -- 6. Lantai (housingAssessmentPartId: 6)
  (13, 6, '1','Retak rambut menyebar sebagian atau seluruh', '[{"total": "1", "score": 2}, {"total": "≥ 3", "score": 3}]'::jsonb, 'Active', NOW(), NOW()),
  (14, 6, '2', 'Retak besar/terbelah/hancur menyebar sebagian atau seluruh', '[{"total": "1", "score": 8}, {"total": "2", "score": 9}, {"total": "≥ 3", "score": 10}]'::jsonb, 'Active', NOW(), NOW())
ON CONFLICT ("housingDamageAssessmentId") DO UPDATE 
SET "surveyDamageQuestion" = EXCLUDED."surveyDamageQuestion",
    "surveyScoring" = EXCLUDED."surveyScoring",
    "housingDamageAssessmentStatus" = EXCLUDED."housingDamageAssessmentStatus",
    "updatedAt" = NOW();

-- 4. LOSS ASSESSMENT (Parameter Penilaian Kerugian Dampak Bencana)
INSERT INTO "LossAssessment" (
  "lossAssessmentId", 
  "typeOfLoss", 
  "surveyLossQuestion", 
  "lossAssessmentStatus", 
  "createdAt", 
  "updatedAt"
)
VALUES
  -- Penambahan biaya yang terjadi akibat bencana (additional_cost)
  (1, 'additional_cost', 'Sewa alat untuk pembersihan puing', 'Active', NOW(), NOW()), 
  (2, 'additional_cost', 'Tenaga kerja untuk pembersihan puing', 'Active', NOW(), NOW()), 
  (3, 'additional_cost', 'Biaya penanganan sementara', 'Active', NOW(), NOW()), 
  (4, 'additional_cost', 'Biaya peningkatan bahan bakar', 'Active', NOW(), NOW()), 
  (5, 'additional_cost', 'Biaya lainnya', 'Active', NOW(), NOW()), 

  -- Kehilangan pendapatan/potensi pendapatan yang terjadi akibat bencana (income_lost)
  (6, 'income_lost', 'Pendapatan individu atau rumah tangga', 'Active', NOW(), NOW()), 
  (7, 'income_lost', 'Pendapatan usaha perorangan', 'Active', NOW(), NOW()), 
  (8, 'income_lost', 'Pendapatan badan usaha atau organisasi', 'Active', NOW(), NOW()), 
  (9, 'income_lost', 'Pendapatan lainnya', 'Active', NOW(), NOW())
ON CONFLICT ("lossAssessmentId") DO UPDATE 
SET "typeOfLoss" = EXCLUDED."typeOfLoss",
    "surveyLossQuestion" = EXCLUDED."surveyLossQuestion",
    "lossAssessmentStatus" = EXCLUDED."lossAssessmentStatus",
    "updatedAt" = NOW();

-- 5. DISASTER (Data Master Kejadian Bencana)
INSERT INTO "Disaster" (
  "disasterId", "disasterCode", "disasterName", "disasterCategory", 
  "description", "Status", "disasterDate", "provinceId", "regencyId", "createdAt", "updatedAt"
)
VALUES
  (1, 'DIS-2024-CJR-001', 'Gempa Bumi Tektonik Cianjur', 'Gempa Bumi', 
   'Gempa bumi dangkal M 5.6 yang memicu kerusakan permukiman dan tanah longsor di beberapa kecamatan.', 'Inactive',NOW(), '11', '11.09', NOW(), NOW()),
  
  (2, 'DIS-2024-SKB-002', 'Banjir Bandang Cicurug Sukabumi', 'Banjir Bandang', 
   'Luapan air sungai akibat curah hujan ekstrem merusak jembatan antardesa dan puluhan rumah warga.', 'Active',NOW(), '11', '11.09', NOW(), NOW()),
  
  (3, 'DIS-2024-BGR-003', 'Tanah Longsor Perbukitan Puncak', 'Tanah Longsor', 
   'Pergerakan tanah pada tebing lereng curam yang menimbun akses jalan utama dan fasilitas publik.', 'Active',NOW(), '11', '11.09', NOW(), NOW()),
  
  (4, 'DIS-2024-BDG-004', 'Angin Puting Beliung Rancaekek', 'Angin Puting Beliung', 
   'Pusaran angin kencang merusak struktur rangka atap bangunan industri, fasilitas umum, dan permukiman padat.', 'Active',NOW(), '11', '11.09', NOW(), NOW()),
  
  (5, 'DIS-2024-LBG-005', 'Kekeringan dan Krisis Air Bersih', 'Kekeringan', 
   'Kekeringan berkepanjangan pada sektor pertanian pangan dan sumber mata air baku masyarakat desa.', 'Active',NOW(), '11', '11.09', NOW(), NOW())
ON CONFLICT ("disasterCode") DO UPDATE 
SET "disasterName" = EXCLUDED."disasterName",
    "disasterCategory" = EXCLUDED."disasterCategory",
    "description" = EXCLUDED."description",
    "Status" = EXCLUDED."Status",
    "updatedAt" = NOW();

INSERT INTO "UserSurveyor" ("surveyorId", "nip", "nama", "phoneNumber", "email", "password", "status", "provinceId", "regencyId", "lastLogin", "createdAt", "updatedAt") VALUES (1, '21312321', 'budi', '086321731321', 'surveyor.sipantas@gmail.com', '$2b$10$8ZCQNerrB.Xh922RskPPVeUVDYzhG.OGQlizUpayQGjsFBd7De8ue', 'Active', '11', '11.01', '2026-10-22T07:50:20.521+07:00', '2026-10-22T07:48:24.013+07:00', '2026-10-22T07:50:20.535+07:00');

-- ==========================================
-- SYNCHRONIZE POSTGRESQL SEQUENCES
-- ==========================================
SELECT setval(pg_get_serial_sequence('"Sector"', 'sectorId'), COALESCE(MAX("sectorId"), 1)) FROM "Sector";
SELECT setval(pg_get_serial_sequence('"HousingAssessmentPart"', 'housingAssessmentPartId'), COALESCE(MAX("housingAssessmentPartId"), 1)) FROM "HousingAssessmentPart";
SELECT setval(pg_get_serial_sequence('"HousingDamageAssessment"', 'housingDamageAssessmentId'), COALESCE(MAX("housingDamageAssessmentId"), 1)) FROM "HousingDamageAssessment";
SELECT setval(pg_get_serial_sequence('"LossAssessment"', 'lossAssessmentId'), COALESCE(MAX("lossAssessmentId"), 1)) FROM "LossAssessment";
SELECT setval(pg_get_serial_sequence('"Disaster"', 'disasterId'), COALESCE(MAX("disasterId"), 1)) FROM "Disaster";