-- AlterTable
ALTER TABLE `application` MODIFY `company_remark` TEXT NULL;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `link` VARCHAR(255) NULL;
