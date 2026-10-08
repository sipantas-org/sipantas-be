-- CreateEnum
CREATE TYPE "LossAssessmentTypeOfLoss" AS ENUM ('additional_cost', 'income_lost');

-- CreateEnum
CREATE TYPE "LossAssessmentStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "Loss_Assessment" (
    "ID_Loss_Assessment" SERIAL NOT NULL,
    "Type_of_Loss" "LossAssessmentTypeOfLoss" NOT NULL,
    "Survey_Loss_Question" TEXT NOT NULL,
    "Status" "LossAssessmentStatus" NOT NULL,
    "Created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Loss_Assessment_pkey" PRIMARY KEY ("ID_Loss_Assessment")
);
