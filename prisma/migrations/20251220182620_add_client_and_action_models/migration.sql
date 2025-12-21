-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `workStatus` ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    `role` ENUM('SUPER', 'CLIENT') NOT NULL DEFAULT 'CLIENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Client_phone_key`(`phone`),
    INDEX `Client_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Action` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `maxCount` INTEGER NOT NULL DEFAULT 10,
    `processedCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `completedAt` DATETIME(3) NULL,

    INDEX `Action_clientId_idx`(`clientId`),
    INDEX `Action_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActionItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `actionId` INTEGER NOT NULL,
    `telegramUserId` INTEGER NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ActionItem_actionId_idx`(`actionId`),
    INDEX `ActionItem_telegramUserId_idx`(`telegramUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActionItem` ADD CONSTRAINT `ActionItem_actionId_fkey` FOREIGN KEY (`actionId`) REFERENCES `Action`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActionItem` ADD CONSTRAINT `ActionItem_telegramUserId_fkey` FOREIGN KEY (`telegramUserId`) REFERENCES `TelegramUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
