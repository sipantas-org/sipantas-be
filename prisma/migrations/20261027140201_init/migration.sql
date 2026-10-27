-- CreateEnum
CREATE TYPE "DisasterStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "PartStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "HousingDamageAssessmentStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "LossAssessmentTypeOfLoss" AS ENUM ('additional_cost', 'income_lost');

-- CreateEnum
CREATE TYPE "LossAssessmentStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "SectorStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "DamageLevel" AS ENUM ('Tidak Masuk Kategori', 'Ringan', 'Sedang', 'Berat');

-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('Pending', 'On Complain', 'On Budgeting', 'On Construction', 'Completed');

-- CreateEnum
CREATE TYPE "Authority" AS ENUM ('Pusat', 'Provinsi', 'Kabupaten / Kota', 'Masyarakat / Swasta');

-- CreateEnum
CREATE TYPE "DamageCategory" AS ENUM ('Ringan', 'Sedang', 'Berat');

-- CreateEnum
CREATE TYPE "DurationUnit" AS ENUM ('Hari', 'Bulan', 'Tahun');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "LoginStatus" AS ENUM ('Success', 'Failed');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('Administrator', 'Monitoring');

-- CreateEnum
CREATE TYPE "SurveyorStatus" AS ENUM ('Pending', 'Active', 'Inactive', 'Rejected');

-- CreateTable
CREATE TABLE "Disaster" (
    "disasterId" SERIAL NOT NULL,
    "disasterCode" TEXT NOT NULL,
    "disasterName" TEXT NOT NULL,
    "disasterCategory" TEXT NOT NULL,
    "disasterDate" DATE NOT NULL,
    "description" TEXT,
    "Status" "DisasterStatus" NOT NULL,
    "provinceId" VARCHAR(20),
    "regencyId" VARCHAR(20),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Disaster_pkey" PRIMARY KEY ("disasterId")
);

-- CreateTable
CREATE TABLE "HousingAssessmentPart" (
    "housingAssessmentPartId" SERIAL NOT NULL,
    "partName" TEXT NOT NULL,
    "partStatus" "PartStatus" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "HousingAssessmentPart_pkey" PRIMARY KEY ("housingAssessmentPartId")
);

-- CreateTable
CREATE TABLE "HousingDamageAssessment" (
    "housingDamageAssessmentId" SERIAL NOT NULL,
    "housingAssessmentPartId" INTEGER NOT NULL,
    "surveyOrderNumber" INTEGER NOT NULL,
    "surveyDamageQuestion" TEXT NOT NULL,
    "surveyScoring" JSONB NOT NULL,
    "housingDamageAssessmentStatus" "HousingDamageAssessmentStatus" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "HousingDamageAssessment_pkey" PRIMARY KEY ("housingDamageAssessmentId")
);

-- CreateTable
CREATE TABLE "LossAssessment" (
    "lossAssessmentId" SERIAL NOT NULL,
    "typeOfLoss" "LossAssessmentTypeOfLoss" NOT NULL,
    "surveyLossQuestion" TEXT NOT NULL,
    "lossAssessmentStatus" "LossAssessmentStatus" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "LossAssessment_pkey" PRIMARY KEY ("lossAssessmentId")
);

-- CreateTable
CREATE TABLE "Sector" (
    "sectorId" SERIAL NOT NULL,
    "parentId" INTEGER,
    "sectorName" TEXT NOT NULL,
    "description" TEXT,
    "status" "SectorStatus" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("sectorId")
);

-- CreateTable
CREATE TABLE "MasterAreaProvince" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "MasterAreaProvince_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterAreaRegency" (
    "id" VARCHAR(20) NOT NULL,
    "provinceId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "MasterAreaRegency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterAreaDistrict" (
    "id" VARCHAR(20) NOT NULL,
    "regencyId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "MasterAreaDistrict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterAreaVillage" (
    "id" VARCHAR(20) NOT NULL,
    "districtId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "MasterAreaVillage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "surveyId" SERIAL NOT NULL,
    "disasterId" INTEGER NOT NULL,
    "sectorId" INTEGER NOT NULL,
    "surveyStatus" "SurveyStatus" NOT NULL,
    "surveyorId" INTEGER,
    "provinceId" VARCHAR(20),
    "regencyId" VARCHAR(20),
    "districtId" VARCHAR(20),
    "villageId" VARCHAR(20),
    "addressDetail" TEXT NOT NULL,
    "authority" "Authority" NOT NULL,
    "nik" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "damageLevel" "DamageLevel" NOT NULL,
    "volume" TEXT NOT NULL,
    "volumeUnit" TEXT NOT NULL,
    "volumeUnitOther" TEXT NOT NULL,
    "totalPriceUnit" DECIMAL(15,2) NOT NULL,
    "totalPriceFurniture" DECIMAL(15,2) NOT NULL,
    "totalScore" DECIMAL(15,2) NOT NULL,
    "sourceOfBudgetting" TEXT,
    "surveyFolderPath" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("surveyId")
);

-- CreateTable
CREATE TABLE "SurveyFileDetail" (
    "id" TEXT NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyFileDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyFurnitureDetail" (
    "surveyFurnitureDetailId" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "furnitureName" TEXT NOT NULL,
    "damageCategory" "DamageCategory" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "totalPrice" DECIMAL(15,2) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SurveyFurnitureDetail_pkey" PRIMARY KEY ("surveyFurnitureDetailId")
);

-- CreateTable
CREATE TABLE "SurveyHousingDetail" (
    "surveyHousingDetailId" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "housingDamageAssessmentId" INTEGER NOT NULL,
    "totalUnit" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "SurveyHousingDetail_pkey" PRIMARY KEY ("surveyHousingDetailId")
);

-- CreateTable
CREATE TABLE "SurveyLostDetail" (
    "surveyLostDetailId" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "lossAssessmentId" INTEGER NOT NULL,
    "totalUnit" INTEGER NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "duration" INTEGER NOT NULL,
    "durationUnit" "DurationUnit" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SurveyLostDetail_pkey" PRIMARY KEY ("surveyLostDetailId")
);

-- CreateTable
CREATE TABLE "ActivityHistory" (
    "activityId" SERIAL NOT NULL,
    "userId" INTEGER,
    "adminId" INTEGER,
    "relationId" INTEGER,
    "module" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityHistory_pkey" PRIMARY KEY ("activityId")
);

-- CreateTable
CREATE TABLE "ApprovalUser" (
    "approvalId" SERIAL NOT NULL,
    "surveyorId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,
    "statusApproval" "ApprovalStatus" NOT NULL,
    "description" TEXT,
    "approvalDate" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ApprovalUser_pkey" PRIMARY KEY ("approvalId")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "loginId" SERIAL NOT NULL,
    "userId" INTEGER,
    "adminId" INTEGER,
    "ipAddress" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "loginAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceInfo" TEXT,
    "statusLogin" "LoginStatus" NOT NULL,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("loginId")
);

-- CreateTable
CREATE TABLE "UserAdmin" (
    "adminId" SERIAL NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "AdminStatus" NOT NULL,
    "role" "AdminRole" NOT NULL,
    "lastLogin" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "UserAdmin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "UserSurveyor" (
    "surveyorId" SERIAL NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "SurveyorStatus" NOT NULL,
    "provinceId" VARCHAR(20) NOT NULL,
    "regencyId" VARCHAR(20) NOT NULL,
    "lastLogin" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "UserSurveyor_pkey" PRIMARY KEY ("surveyorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Disaster_disasterCode_key" ON "Disaster"("disasterCode");

-- CreateIndex
CREATE UNIQUE INDEX "HousingAssessmentPart_partName_key" ON "HousingAssessmentPart"("partName");

-- CreateIndex
CREATE UNIQUE INDEX "HousingDamageAssessment_housingAssessmentPartId_surveyDamag_key" ON "HousingDamageAssessment"("housingAssessmentPartId", "surveyDamageQuestion");

-- CreateIndex
CREATE UNIQUE INDEX "Sector_sectorName_key" ON "Sector"("sectorName");

-- CreateIndex
CREATE INDEX "SurveyFileDetail_surveyId_idx" ON "SurveyFileDetail"("surveyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAdmin_nip_key" ON "UserAdmin"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "UserAdmin_email_key" ON "UserAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSurveyor_nip_key" ON "UserSurveyor"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "UserSurveyor_email_key" ON "UserSurveyor"("email");

-- AddForeignKey
ALTER TABLE "Disaster" ADD CONSTRAINT "Disaster_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "MasterAreaProvince"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disaster" ADD CONSTRAINT "Disaster_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "MasterAreaRegency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HousingDamageAssessment" ADD CONSTRAINT "HousingDamageAssessment_housingAssessmentPartId_fkey" FOREIGN KEY ("housingAssessmentPartId") REFERENCES "HousingAssessmentPart"("housingAssessmentPartId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "Sector_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Sector"("sectorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterAreaRegency" ADD CONSTRAINT "MasterAreaRegency_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "MasterAreaProvince"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterAreaDistrict" ADD CONSTRAINT "MasterAreaDistrict_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "MasterAreaRegency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterAreaVillage" ADD CONSTRAINT "MasterAreaVillage_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "MasterAreaDistrict"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_surveyorId_fkey" FOREIGN KEY ("surveyorId") REFERENCES "UserSurveyor"("surveyorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "MasterAreaProvince"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "MasterAreaRegency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "MasterAreaDistrict"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "MasterAreaVillage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyFileDetail" ADD CONSTRAINT "SurveyFileDetail_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("surveyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyHousingDetail" ADD CONSTRAINT "SurveyHousingDetail_housingDamageAssessmentId_fkey" FOREIGN KEY ("housingDamageAssessmentId") REFERENCES "HousingDamageAssessment"("housingDamageAssessmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyLostDetail" ADD CONSTRAINT "SurveyLostDetail_lossAssessmentId_fkey" FOREIGN KEY ("lossAssessmentId") REFERENCES "LossAssessment"("lossAssessmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityHistory" ADD CONSTRAINT "ActivityHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSurveyor"("surveyorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityHistory" ADD CONSTRAINT "ActivityHistory_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "UserAdmin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalUser" ADD CONSTRAINT "ApprovalUser_surveyorId_fkey" FOREIGN KEY ("surveyorId") REFERENCES "UserSurveyor"("surveyorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalUser" ADD CONSTRAINT "ApprovalUser_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "UserAdmin"("adminId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSurveyor"("surveyorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "UserAdmin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSurveyor" ADD CONSTRAINT "UserSurveyor_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "MasterAreaProvince"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSurveyor" ADD CONSTRAINT "UserSurveyor_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "MasterAreaRegency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
