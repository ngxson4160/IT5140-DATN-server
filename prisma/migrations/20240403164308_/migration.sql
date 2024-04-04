/*
  Warnings:

  - Made the column `email` on table `company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatar` on table `company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cover_image` on table `company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `extra_mail` JSON NULL,
    ADD COLUMN `extra_phone_number` JSON NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `avatar` VARCHAR(191) NOT NULL,
    MODIFY `cover_image` VARCHAR(191) NOT NULL,
    MODIFY `phone_number` JSON NOT NULL;
