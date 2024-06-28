-- AlterTable
ALTER TABLE `application` MODIFY `candidate_cv` VARCHAR(255) NULL,
    MODIFY `candidate_name` VARCHAR(255) NOT NULL,
    MODIFY `candidate_email` VARCHAR(255) NOT NULL,
    MODIFY `candidate_phone_number` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `blog` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `image` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `candidate_information` MODIFY `target` VARCHAR(255) NULL,
    MODIFY `public_attachment_cv` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `city` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `company` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `primaryEmail` VARCHAR(255) NOT NULL,
    MODIFY `avatar` VARCHAR(255) NULL,
    MODIFY `cover_image` VARCHAR(255) NULL,
    MODIFY `website` VARCHAR(255) NULL,
    MODIFY `tax_code` VARCHAR(255) NULL,
    MODIFY `primary_address` VARCHAR(255) NULL,
    MODIFY `phone_number` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `configuration` MODIFY `key` VARCHAR(255) NOT NULL,
    MODIFY `value` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `conversation` MODIFY `name` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `district` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `job` MODIFY `title` VARCHAR(255) NULL,
    MODIFY `office_name` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `job_category` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `job_category_parent` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `notification_template` MODIFY `code` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `permission` MODIFY `action` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `role` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `tag` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `first_name` VARCHAR(255) NOT NULL,
    MODIFY `last_name` VARCHAR(255) NOT NULL,
    MODIFY `avatar` VARCHAR(255) NULL,
    MODIFY `address` VARCHAR(255) NULL;
