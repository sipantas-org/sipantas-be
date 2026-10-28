-- CreateEnum
CREATE TYPE "ComplainAction" AS ENUM ('Resolved', 'Rejected');

-- AlterEnum
ALTER TYPE "ComplainStatus" ADD VALUE 'On Progress';

-- AlterTable
ALTER TABLE "SurveyComplain" ADD COLUMN     "action" "ComplainAction";
