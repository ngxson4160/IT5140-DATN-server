/*
  Warnings:

  - Made the column `candidate_name` on table `application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `application` MODIFY `candidate_name` VARCHAR(191) NOT NULL;
