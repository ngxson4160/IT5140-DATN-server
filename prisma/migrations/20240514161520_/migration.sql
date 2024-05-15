/*
  Warnings:

  - You are about to drop the column `type_public_cv` on the `candidate_information` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `candidate_information` DROP COLUMN `type_public_cv`,
    ADD COLUMN `public_cv_type` INTEGER NOT NULL DEFAULT 0;
