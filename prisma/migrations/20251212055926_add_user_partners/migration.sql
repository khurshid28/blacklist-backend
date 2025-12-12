-- CreateTable
CREATE TABLE `UserPartner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `partnerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserPartner_userId_idx`(`userId`),
    INDEX `UserPartner_partnerId_idx`(`partnerId`),
    UNIQUE INDEX `UserPartner_userId_partnerId_key`(`userId`, `partnerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserPartner` ADD CONSTRAINT `UserPartner_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPartner` ADD CONSTRAINT `UserPartner_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
