/*
  Warnings:

  - Added the required column `candidate_cv` to the `application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidate_email` to the `application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidate_first_name` to the `application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidate_last_name` to the `application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidate_phone_number` to the `application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `application` ADD COLUMN `candidate_cv` VARCHAR(191) NOT NULL,
    ADD COLUMN `candidate_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `candidate_first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `candidate_last_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `candidate_phone_number` VARCHAR(191) NOT NULL,
    MODIFY `status` TINYINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `blog` MODIFY `status` TINYINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `job` MODIFY `status` TINYINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `message` MODIFY `status` TINYINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `notification` MODIFY `status` TINYINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `notification_template` MODIFY `status` TINYINT NOT NULL DEFAULT 1;
