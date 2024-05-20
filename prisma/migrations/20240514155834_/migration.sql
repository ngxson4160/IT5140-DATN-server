-- AlterTable
ALTER TABLE `candidate_information` ADD COLUMN `public_attachment_cv` VARCHAR(191) NULL,
    ADD COLUMN `type_public_cv` INTEGER NOT NULL DEFAULT 0;
