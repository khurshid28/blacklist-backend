-- CreateTable
CREATE TABLE `TelegramUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `telegramId` BIGINT NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL DEFAULT '',
    `username` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TelegramUser_telegramId_key`(`telegramId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
