-- DropIndex
DROP INDEX `job_title_description_requirement_idx` ON `job`;

-- CreateIndex
CREATE FULLTEXT INDEX `job_title_idx` ON `job`(`title`);

-- CreateIndex
CREATE FULLTEXT INDEX `job_description_idx` ON `job`(`description`);

-- CreateIndex
CREATE FULLTEXT INDEX `job_requirement_idx` ON `job`(`requirement`);
