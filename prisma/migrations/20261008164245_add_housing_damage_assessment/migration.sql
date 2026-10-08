/*
  Warnings:

  - You are about to drop the `Housing_Assessment_Part` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "HousingDamageAssessmentStatus" AS ENUM ('Active', 'Inactive');

-- DropTable
DROP TABLE "Housing_Assessment_Part";

-- CreateTable
CREATE TABLE "Housing_Damage_Assessment" (
    "ID_Housing_Damage_Assessment" SERIAL NOT NULL,
    "ID_Housing_Assessment_Part" INTEGER NOT NULL,
    "Survey_Damage_Question" TEXT NOT NULL,
    "Survey_Scoring" JSONB NOT NULL,
    "Status" "HousingDamageAssessmentStatus" NOT NULL,
    "Created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Housing_Damage_Assessment_pkey" PRIMARY KEY ("ID_Housing_Damage_Assessment")
);
