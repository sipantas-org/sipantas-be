-- CreateTable
CREATE TABLE "SurveyComplainDocument" (
    "id" TEXT NOT NULL,
    "complainId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyComplainDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SurveyComplainDocument_complainId_idx" ON "SurveyComplainDocument"("complainId");

-- AddForeignKey
ALTER TABLE "SurveyComplainDocument" ADD CONSTRAINT "SurveyComplainDocument_complainId_fkey" FOREIGN KEY ("complainId") REFERENCES "SurveyComplain"("complainId") ON DELETE CASCADE ON UPDATE CASCADE;
