-- AlterTable
ALTER TABLE `User` ADD COLUMN `canApplyJob` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `desiredSalary` VARCHAR(191) NULL,
    ADD COLUMN `yearExperience` DOUBLE NULL;
