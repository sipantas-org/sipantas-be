/*
  Warnings:

  - The values [Resolved,Rejected] on the enum `ComplainStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ComplainStatus_new" AS ENUM ('Pending', 'On Progress', 'Completed');
ALTER TABLE "public"."SurveyComplain" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "SurveyComplain" ALTER COLUMN "status" TYPE "ComplainStatus_new" USING ("status"::text::"ComplainStatus_new");
ALTER TYPE "ComplainStatus" RENAME TO "ComplainStatus_old";
ALTER TYPE "ComplainStatus_new" RENAME TO "ComplainStatus";
DROP TYPE "public"."ComplainStatus_old";
ALTER TABLE "SurveyComplain" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;
