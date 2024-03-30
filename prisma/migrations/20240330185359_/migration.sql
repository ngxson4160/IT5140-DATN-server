/*
  Warnings:

  - You are about to alter the column `desiredSalary` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `desiredSalary` DOUBLE NULL;
