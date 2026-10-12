-- AlterTable
ALTER TABLE "Disaster" DROP COLUMN "disasterStatus",
ADD COLUMN     "Status" "DisasterStatus" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Housing_Assessment_Part_partName_key" ON "Housing_Assessment_Part"("partName");

-- CreateIndex
CREATE UNIQUE INDEX "Sector_sectorName_key" ON "Sector"("sectorName");

-- AddForeignKey
ALTER TABLE "Housing_Damage_Assessment" ADD CONSTRAINT "Housing_Damage_Assessment_ID_Housing_Assessment_Part_fkey" FOREIGN KEY ("ID_Housing_Assessment_Part") REFERENCES "Housing_Assessment_Part"("housingAssessmentPartId") ON DELETE RESTRICT ON UPDATE CASCADE;
