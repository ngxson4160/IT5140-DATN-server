/*
  Warnings:

  - You are about to drop the column `home_page` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `total_staff` on the `company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `company` DROP COLUMN `home_page`,
    DROP COLUMN `total_staff`,
    ADD COLUMN `size_type` INTEGER NULL,
    ADD COLUMN `tax_code` VARCHAR(191) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;
