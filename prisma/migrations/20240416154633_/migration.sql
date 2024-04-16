-- DropForeignKey
ALTER TABLE `job` DROP FOREIGN KEY `job_creator_id_fkey`;

-- DropForeignKey
ALTER TABLE `job` DROP FOREIGN KEY `job_job_category_id_fkey`;

-- AlterTable
ALTER TABLE `job` MODIFY `creator_id` INTEGER NULL,
    MODIFY `job_category_id` INTEGER NULL,
    MODIFY `title` VARCHAR(191) NULL,
    MODIFY `position` VARCHAR(191) NULL,
    MODIFY `work_mode` TINYINT NULL,
    MODIFY `office_name` VARCHAR(191) NULL,
    MODIFY `city` JSON NULL,
    MODIFY `address` JSON NULL,
    MODIFY `quantity` INTEGER NULL,
    MODIFY `total_views` INTEGER NULL DEFAULT 0,
    MODIFY `total_candidate` INTEGER NULL DEFAULT 0,
    MODIFY `benefits` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `requirement` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `job` ADD CONSTRAINT `job_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job` ADD CONSTRAINT `job_job_category_id_fkey` FOREIGN KEY (`job_category_id`) REFERENCES `job_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
