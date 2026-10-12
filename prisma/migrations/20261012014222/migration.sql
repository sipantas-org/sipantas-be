/*
  Warnings:

  - The values [On_Budgeting] on the enum `DisasterStatus` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Disaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Created_At` on the `Disaster` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Disaster` table. All the data in the column will be lost.
  - You are about to drop the column `Disaster_Category` on the `Disaster` table. All the data in the column will be lost.
  - You are about to drop the column `Disaster_Code` on the `Disaster` table. All the data in the column will be lost.
  - You are about to drop the column `Disaster_Name` on the `Disaster` table. All the data in the column will be lost.
  - You are about to drop the column `ID_Disaster` on the `Disaster` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Disaster` table. All the data in the column will be lost.
  - You are about to drop the column `Updated_At` on the `Disaster` table. All the data in the column will be lost.
  - The primary key for the `Housing_Assessment_Part` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Created_At` on the `Housing_Assessment_Part` table. All the data in the column will be lost.
  - You are about to drop the column `ID_Housing_Assessment_Part` on the `Housing_Assessment_Part` table. All the data in the column will be lost.
  - You are about to drop the column `Part_Name` on the `Housing_Assessment_Part` table. All the data in the column will be lost.
  - You are about to drop the column `Updated_At` on the `Housing_Assessment_Part` table. All the data in the column will be lost.
  - The primary key for the `Sector` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Created_At` on the `Sector` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Sector` table. All the data in the column will be lost.
  - You are about to drop the column `ID_Sector` on the `Sector` table. All the data in the column will be lost.
  - You are about to drop the column `Parent_ID` on the `Sector` table. All the data in the column will be lost.
  - You are about to drop the column `Sector_Name` on the `Sector` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Sector` table. All the data in the column will be lost.
  - You are about to drop the column `Updated_At` on the `Sector` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[disasterCode]` on the table `Disaster` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `disasterCategory` to the `Disaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disasterCode` to the `Disaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disasterName` to the `Disaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disasterStatus` to the `Disaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Disaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partName` to the `Housing_Assessment_Part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partStatus` to the `Housing_Assessment_Part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Housing_Assessment_Part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectorName` to the `Sector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Sector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sector` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PartStatus" AS ENUM ('Active', 'Inactive');

-- AlterEnum
BEGIN;
CREATE TYPE "DisasterStatus_new" AS ENUM ('Active', 'On Budgeting', 'Completed');
ALTER TABLE "Disaster" ALTER COLUMN "disasterStatus" TYPE "DisasterStatus_new" USING ("disasterStatus"::text::"DisasterStatus_new");
ALTER TYPE "DisasterStatus" RENAME TO "DisasterStatus_old";
ALTER TYPE "DisasterStatus_new" RENAME TO "DisasterStatus";
DROP TYPE "public"."DisasterStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Sector" DROP CONSTRAINT "Sector_Parent_ID_fkey";

-- DropIndex
DROP INDEX "Disaster_Disaster_Code_key";

-- AlterTable
ALTER TABLE "Disaster" DROP CONSTRAINT "Disaster_pkey",
DROP COLUMN "Created_At",
DROP COLUMN "Description",
DROP COLUMN "Disaster_Category",
DROP COLUMN "Disaster_Code",
DROP COLUMN "Disaster_Name",
DROP COLUMN "ID_Disaster",
DROP COLUMN "Status",
DROP COLUMN "Updated_At",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "disasterCategory" TEXT NOT NULL,
ADD COLUMN     "disasterCode" VARCHAR(20) NOT NULL,
ADD COLUMN     "disasterId" SERIAL NOT NULL,
ADD COLUMN     "disasterName" TEXT NOT NULL,
ADD COLUMN     "disasterStatus" "DisasterStatus" NOT NULL,
ADD COLUMN     "provinceId" VARCHAR(20),
ADD COLUMN     "regencyId" VARCHAR(20),
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
ADD CONSTRAINT "Disaster_pkey" PRIMARY KEY ("disasterId");

-- AlterTable
ALTER TABLE "Housing_Assessment_Part" DROP CONSTRAINT "Housing_Assessment_Part_pkey",
DROP COLUMN "Created_At",
DROP COLUMN "ID_Housing_Assessment_Part",
DROP COLUMN "Part_Name",
DROP COLUMN "Updated_At",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "housingAssessmentPartId" SERIAL NOT NULL,
ADD COLUMN     "partName" TEXT NOT NULL,
ADD COLUMN     "partStatus" "PartStatus" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
ADD CONSTRAINT "Housing_Assessment_Part_pkey" PRIMARY KEY ("housingAssessmentPartId");

-- AlterTable
ALTER TABLE "Sector" DROP CONSTRAINT "Sector_pkey",
DROP COLUMN "Created_At",
DROP COLUMN "Description",
DROP COLUMN "ID_Sector",
DROP COLUMN "Parent_ID",
DROP COLUMN "Sector_Name",
DROP COLUMN "Status",
DROP COLUMN "Updated_At",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "parentId" INTEGER,
ADD COLUMN     "sectorId" SERIAL NOT NULL,
ADD COLUMN     "sectorName" TEXT NOT NULL,
ADD COLUMN     "status" "SectorStatus" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
ADD CONSTRAINT "Sector_pkey" PRIMARY KEY ("sectorId");

-- CreateIndex
CREATE UNIQUE INDEX "Disaster_disasterCode_key" ON "Disaster"("disasterCode");

-- AddForeignKey
ALTER TABLE "Disaster" ADD CONSTRAINT "Disaster_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Master_Area_Province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disaster" ADD CONSTRAINT "Disaster_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "Master_Area_Regency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "Sector_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Sector"("sectorId") ON DELETE SET NULL ON UPDATE CASCADE;
