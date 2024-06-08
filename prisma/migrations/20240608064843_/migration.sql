-- CreateIndex
CREATE FULLTEXT INDEX `job_title_description_requirement_idx` ON `job`(`title`, `description`, `requirement`);
