/*
  Warnings:

  - You are about to drop the column `email` on the `company` table. All the data in the column will be lost.
  - Added the required column `primaryEmail` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` DROP COLUMN `email`,
    ADD COLUMN `primaryEmail` VARCHAR(191) NOT NULL;
