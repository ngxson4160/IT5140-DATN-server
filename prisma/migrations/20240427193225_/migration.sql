/*
  Warnings:

  - You are about to drop the column `address` on the `candidate_information` table. All the data in the column will be lost.
  - You are about to drop the column `can_apply_job` on the `candidate_information` table. All the data in the column will be lost.
  - You are about to drop the column `city_id` on the `candidate_information` table. All the data in the column will be lost.
  - You are about to drop the column `desired_city` on the `candidate_information` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `job` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `candidate_information` DROP FOREIGN KEY `candidate_information_city_id_fkey`;

-- DropForeignKey
ALTER TABLE `candidate_information` DROP FOREIGN KEY `candidate_information_desired_job_category_id_fkey`;

-- AlterTable
ALTER TABLE `candidate_information` DROP COLUMN `address`,
    DROP COLUMN `can_apply_job`,
    DROP COLUMN `city_id`,
    DROP COLUMN `desired_city`,
    ADD COLUMN `advancedSkill` JSON NULL,
    ADD COLUMN `certificate` JSON NULL,
    ADD COLUMN `desired_city_id` INTEGER NULL,
    ADD COLUMN `desired_job_level` INTEGER NULL,
    ADD COLUMN `desired_job_mode` INTEGER NULL,
    ADD COLUMN `education` JSON NULL,
    ADD COLUMN `languageSkill` JSON NULL,
    ADD COLUMN `work_experience` JSON NULL,
    MODIFY `desired_job_category_id` INTEGER NULL,
    MODIFY `cv` JSON NULL,
    MODIFY `year_experience` DOUBLE NULL;

-- AlterTable
ALTER TABLE `job` DROP COLUMN `hours`,
    DROP COLUMN `position`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `city_id` INTEGER NULL,
    ADD COLUMN `district` VARCHAR(191) NULL,
    ADD COLUMN `maritalStatus` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_information` ADD CONSTRAINT `candidate_information_desired_job_category_id_fkey` FOREIGN KEY (`desired_job_category_id`) REFERENCES `job_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_information` ADD CONSTRAINT `candidate_information_desired_city_id_fkey` FOREIGN KEY (`desired_city_id`) REFERENCES `city`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
