/*
  Warnings:

  - The values [On Construction] on the enum `SurveyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SurveyStatus_new" AS ENUM ('Pending', 'On Complain', 'On Verification', 'On Budgeting', 'Completed');
ALTER TABLE "Survey" ALTER COLUMN "surveyStatus" TYPE "SurveyStatus_new" USING ("surveyStatus"::text::"SurveyStatus_new");
ALTER TYPE "SurveyStatus" RENAME TO "SurveyStatus_old";
ALTER TYPE "SurveyStatus_new" RENAME TO "SurveyStatus";
DROP TYPE "public"."SurveyStatus_old";
COMMIT;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_disasterId_fkey" FOREIGN KEY ("disasterId") REFERENCES "Disaster"("disasterId") ON DELETE SET NULL ON UPDATE CASCADE;
