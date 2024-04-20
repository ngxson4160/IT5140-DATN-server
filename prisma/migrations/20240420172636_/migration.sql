/*
  Warnings:

  - You are about to drop the column `work_mode` on the `job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `job` DROP COLUMN `work_mode`,
    ADD COLUMN `job_mode` TINYINT NULL;
