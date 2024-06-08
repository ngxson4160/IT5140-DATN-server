-- CreateIndex
CREATE FULLTEXT INDEX `blog_title_content_idx` ON `blog`(`title`, `content`);
