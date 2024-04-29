/*
  Warnings:

  - You are about to drop the column `advancedSkill` on the `candidate_information` table. All the data in the column will be lost.
  - You are about to drop the column `languageSkill` on the `candidate_information` table. All the data in the column will be lost.
  - You are about to drop the column `maritalStatus` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `candidate_information` DROP COLUMN `advancedSkill`,
    DROP COLUMN `languageSkill`,
    ADD COLUMN `advanced_skill` JSON NULL,
    ADD COLUMN `language_skill` JSON NULL,
    ADD COLUMN `target` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `maritalStatus`,
    ADD COLUMN `education_level` INTEGER NULL,
    ADD COLUMN `marital_status` INTEGER NULL;
