/*
  Warnings:

  - You are about to drop the column `city` on the `candidate_information` table. All the data in the column will be lost.
  - You are about to drop the column `extra_city` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `primary_city` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `job` table. All the data in the column will be lost.
  - Added the required column `city_id` to the `candidate_information` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `candidate_information` DROP COLUMN `city`,
    ADD COLUMN `city_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `company` DROP COLUMN `extra_city`,
    DROP COLUMN `primary_city`;

-- AlterTable
ALTER TABLE `job` DROP COLUMN `city`;

-- CreateTable
CREATE TABLE `job_has_city` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_has_city` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `candidate_information` ADD CONSTRAINT `candidate_information_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_has_city` ADD CONSTRAINT `job_has_city_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_has_city` ADD CONSTRAINT `job_has_city_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_has_city` ADD CONSTRAINT `company_has_city_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_has_city` ADD CONSTRAINT `company_has_city_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
