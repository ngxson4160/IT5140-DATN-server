/*
  Warnings:

  - You are about to alter the column `email` on the `company` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- DropIndex
DROP INDEX `company_email_key` ON `company`;

-- AlterTable
ALTER TABLE `company` MODIFY `email` JSON NULL;
