/*
  Warnings:

  - You are about to drop the column `candidate_first_name` on the `application` table. All the data in the column will be lost.
  - You are about to drop the column `candidate_last_name` on the `application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `application` DROP COLUMN `candidate_first_name`,
    DROP COLUMN `candidate_last_name`,
    ADD COLUMN `candidate_name` VARCHAR(191) NULL;
