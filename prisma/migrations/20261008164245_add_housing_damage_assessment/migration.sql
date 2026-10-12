-- CreateEnum
CREATE TYPE "HousingDamageAssessmentStatus" AS ENUM ('Active', 'Inactive');

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
