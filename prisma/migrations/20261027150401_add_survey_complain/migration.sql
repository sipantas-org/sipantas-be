-- CreateEnum
CREATE TYPE "ComplainStatus" AS ENUM ('Pending', 'Resolved', 'Rejected');

-- AlterEnum
ALTER TYPE "SurveyStatus" ADD VALUE 'On Verification';

-- CreateTable
CREATE TABLE "SurveyComplain" (
    "complainId" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "complainantName" TEXT,
    "complainantNik" TEXT,
    "complainantPhone" TEXT,
    "description" TEXT NOT NULL,
    "status" "ComplainStatus" NOT NULL DEFAULT 'Pending',
    "responseNotes" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "SurveyComplain_pkey" PRIMARY KEY ("complainId")
);

-- AddForeignKey
ALTER TABLE "SurveyComplain" ADD CONSTRAINT "SurveyComplain_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("surveyId") ON DELETE SET NULL ON UPDATE CASCADE;
