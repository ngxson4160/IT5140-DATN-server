/*
  Warnings:

  - You are about to drop the column `desired_salary_max` on the `candidate_information` table. All the data in the column will be lost.
  - You are about to drop the column `desired_salary_min` on the `candidate_information` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `candidate_information` DROP COLUMN `desired_salary_max`,
    DROP COLUMN `desired_salary_min`,
    ADD COLUMN `desired_salary` INTEGER NULL;

-- AlterTable
ALTER TABLE `job` MODIFY `salary_min` DOUBLE NULL,
    MODIFY `salary_max` DOUBLE NULL,
    MODIFY `gender` INTEGER NULL;
