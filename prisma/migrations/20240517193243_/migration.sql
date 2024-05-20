/*
  Warnings:

  - You are about to alter the column `cv_type` on the `application` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `application` MODIFY `cv_type` INTEGER NULL;
