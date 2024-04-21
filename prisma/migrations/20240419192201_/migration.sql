/*
  Warnings:

  - You are about to drop the column `year_experience_max` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `year_experience_min` on the `job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `job` DROP COLUMN `year_experience_max`,
    DROP COLUMN `year_experience_min`,
    ADD COLUMN `level` TINYINT NULL,
    ADD COLUMN `year_experience` DOUBLE NULL;
