-- CreateEnum
CREATE TYPE "DisasterStatus" AS ENUM ('Active', 'On_Budgeting', 'Completed');

-- CreateEnum
CREATE TYPE "SectorStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "LoginStatus" AS ENUM ('Success', 'Failed');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('Administrator', 'Monitoring', 'Surveyor');

-- CreateEnum
CREATE TYPE "SurveyorStatus" AS ENUM ('Pending', 'Active', 'Inactive', 'Rejected');

-- CreateTable
CREATE TABLE "Disaster" (
    "ID_Disaster" SERIAL NOT NULL,
    "Disaster_Code" VARCHAR(20) NOT NULL,
    "Disaster_Name" TEXT NOT NULL,
    "Disaster_Category" TEXT NOT NULL,
    "Description" TEXT,
    "Status" "DisasterStatus" NOT NULL,
    "Created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Disaster_pkey" PRIMARY KEY ("ID_Disaster")
);

-- CreateTable
CREATE TABLE "Housing_Assessment_Part" (
    "ID_Housing_Assessment_Part" SERIAL NOT NULL,
    "Part_Name" TEXT NOT NULL,
    "Created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Housing_Assessment_Part_pkey" PRIMARY KEY ("ID_Housing_Assessment_Part")
);

-- CreateTable
CREATE TABLE "Sector" (
    "ID_Sector" SERIAL NOT NULL,
    "Parent_ID" INTEGER,
    "Sector_Name" TEXT NOT NULL,
    "Description" TEXT,
    "Status" "SectorStatus" NOT NULL,
    "Created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("ID_Sector")
);

-- CreateTable
CREATE TABLE "Master_Area_Province" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Master_Area_Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Master_Area_Regency" (
    "id" VARCHAR(20) NOT NULL,
    "provinceId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Master_Area_Regency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Master_Area_District" (
    "id" VARCHAR(20) NOT NULL,
    "regencyId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Master_Area_District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Master_Area_Village" (
    "id" VARCHAR(20) NOT NULL,
    "districtId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Master_Area_Village_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval_User" (
    "ID_Approval" SERIAL NOT NULL,
    "ID_Surveyor" INTEGER NOT NULL,
    "ID_Admin" INTEGER NOT NULL,
    "Status_Approval" "ApprovalStatus" NOT NULL,
    "Description" TEXT,
    "Approval_Date" TIMESTAMPTZ,
    "Created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Approval_User_pkey" PRIMARY KEY ("ID_Approval")
);

-- CreateTable
CREATE TABLE "Login_History" (
    "ID_Login" SERIAL NOT NULL,
    "ID_User" INTEGER,
    "ID_Admin" INTEGER,
    "IP_Address" TEXT NOT NULL,
    "Login_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Device_Info" TEXT,
    "Status_Login" "LoginStatus" NOT NULL,

    CONSTRAINT "Login_History_pkey" PRIMARY KEY ("ID_Login")
);

-- CreateTable
CREATE TABLE "User_Admin" (
    "ID_Admin" SERIAL NOT NULL,
    "NIP" TEXT NOT NULL,
    "Nama" TEXT NOT NULL,
    "Nomor_HP" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Status" "AdminStatus" NOT NULL,
    "Role" "AdminRole" NOT NULL,
    "Last_Login" TIMESTAMPTZ,
    "Created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "User_Admin_pkey" PRIMARY KEY ("ID_Admin")
);

-- CreateTable
CREATE TABLE "User_Surveyor" (
    "ID_Surveyor" SERIAL NOT NULL,
    "NIP" TEXT NOT NULL,
    "Nama" TEXT NOT NULL,
    "Nomor_HP" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Status" "SurveyorStatus" NOT NULL,
    "ID_Province" TEXT NOT NULL,
    "ID_City" TEXT NOT NULL,
    "Last_Login" TIMESTAMPTZ,
    "Created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "User_Surveyor_pkey" PRIMARY KEY ("ID_Surveyor")
);

-- CreateIndex
CREATE UNIQUE INDEX "Disaster_Disaster_Code_key" ON "Disaster"("Disaster_Code");

-- CreateIndex
CREATE UNIQUE INDEX "User_Admin_NIP_key" ON "User_Admin"("NIP");

-- CreateIndex
CREATE UNIQUE INDEX "User_Admin_Email_key" ON "User_Admin"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Surveyor_NIP_key" ON "User_Surveyor"("NIP");

-- CreateIndex
CREATE UNIQUE INDEX "User_Surveyor_Email_key" ON "User_Surveyor"("Email");

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "Sector_Parent_ID_fkey" FOREIGN KEY ("Parent_ID") REFERENCES "Sector"("ID_Sector") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master_Area_Regency" ADD CONSTRAINT "Master_Area_Regency_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Master_Area_Province"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master_Area_District" ADD CONSTRAINT "Master_Area_District_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "Master_Area_Regency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master_Area_Village" ADD CONSTRAINT "Master_Area_Village_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "Master_Area_District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval_User" ADD CONSTRAINT "Approval_User_ID_Surveyor_fkey" FOREIGN KEY ("ID_Surveyor") REFERENCES "User_Surveyor"("ID_Surveyor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval_User" ADD CONSTRAINT "Approval_User_ID_Admin_fkey" FOREIGN KEY ("ID_Admin") REFERENCES "User_Admin"("ID_Admin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Login_History" ADD CONSTRAINT "Login_History_ID_User_fkey" FOREIGN KEY ("ID_User") REFERENCES "User_Surveyor"("ID_Surveyor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Login_History" ADD CONSTRAINT "Login_History_ID_Admin_fkey" FOREIGN KEY ("ID_Admin") REFERENCES "User_Admin"("ID_Admin") ON DELETE SET NULL ON UPDATE CASCADE;
