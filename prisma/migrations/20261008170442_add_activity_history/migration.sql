-- CreateTable
CREATE TABLE "Activity_History" (
    "ID_Activity" SERIAL NOT NULL,
    "ID_User" INTEGER,
    "ID_Admin" INTEGER,
    "Relation_ID" INTEGER,
    "Module" TEXT NOT NULL,
    "Activity" TEXT NOT NULL,
    "Created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_History_pkey" PRIMARY KEY ("ID_Activity")
);

-- AddForeignKey
ALTER TABLE "Activity_History" ADD CONSTRAINT "Activity_History_ID_User_fkey" FOREIGN KEY ("ID_User") REFERENCES "User_Surveyor"("ID_Surveyor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity_History" ADD CONSTRAINT "Activity_History_ID_Admin_fkey" FOREIGN KEY ("ID_Admin") REFERENCES "User_Admin"("ID_Admin") ON DELETE SET NULL ON UPDATE CASCADE;
