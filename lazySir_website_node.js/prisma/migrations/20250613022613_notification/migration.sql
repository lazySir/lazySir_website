-- CreateTable
CREATE TABLE `adminAccount` (
    `accountId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `adminAccount_username_key`(`username`),
    PRIMARY KEY (`accountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adminInfo` (
    `accountInfoId` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `age` INTEGER NULL,
    `gender` BOOLEAN NULL,
    `email` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `state` BOOLEAN NULL DEFAULT true,
    `isDelete` BOOLEAN NULL DEFAULT false,
    `avatar` VARCHAR(191) NULL DEFAULT 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
    `createDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `adminInfo_phone_key`(`phone`),
    UNIQUE INDEX `adminInfo_accountId_key`(`accountId`),
    UNIQUE INDEX `adminInfo_email_key`(`email`),
    INDEX `adminInfo_accountId_idx`(`accountId`),
    PRIMARY KEY (`accountInfoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adminMenu` (
    `menuId` VARCHAR(191) NOT NULL,
    `menuName` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `updateId` VARCHAR(191) NULL,
    `menuValue` VARCHAR(191) NOT NULL,
    `sortOrder` DOUBLE NULL DEFAULT 99,
    `parentId` VARCHAR(191) NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `path` VARCHAR(191) NOT NULL,
    `state` BOOLEAN NOT NULL DEFAULT true,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `icon` VARCHAR(191) NOT NULL DEFAULT 'ep:adminMenu',
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `adminMenu_menuValue_key`(`menuValue`),
    UNIQUE INDEX `adminMenu_path_key`(`path`),
    INDEX `adminMenu_parentId_idx`(`parentId`),
    PRIMARY KEY (`menuId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adminRole` (
    `roleId` VARCHAR(191) NOT NULL,
    `roleName` VARCHAR(191) NOT NULL,
    `state` BOOLEAN NULL DEFAULT true,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `accountId` VARCHAR(191) NOT NULL,
    `updateId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `adminRole_roleName_key`(`roleName`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accountsAndRoles` (
    `accountsAndRolesID` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`accountsAndRolesID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleAndMenu` (
    `RoleAndMenuID` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `menuId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`RoleAndMenuID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sysDictionary` (
    `dictionaryId` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `description` VARCHAR(191) NULL,
    `parentId` VARCHAR(191) NULL,
    `state` BOOLEAN NOT NULL DEFAULT true,
    `accountId` VARCHAR(191) NOT NULL,
    `updatedId` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sysDictionary_key_level_parentId_key`(`key`, `level`, `parentId`),
    PRIMARY KEY (`dictionaryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recruitment` (
    `recruitmentId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NULL,
    `isHot` BOOLEAN NOT NULL DEFAULT false,
    `accountId` VARCHAR(191) NOT NULL,
    `updatedId` VARCHAR(191) NOT NULL,
    `state` BOOLEAN NOT NULL DEFAULT true,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `addressId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `degreeId` VARCHAR(191) NOT NULL,
    `experienceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`recruitmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `newsId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `updatedId` VARCHAR(191) NOT NULL,
    `state` BOOLEAN NOT NULL DEFAULT true,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hits` INTEGER NOT NULL DEFAULT 0,
    `hotSearchWordIds` VARCHAR(191) NULL,
    `companyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`newsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enterpriseHonor` (
    `honorId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `updatedId` VARCHAR(191) NOT NULL,
    `state` BOOLEAN NOT NULL DEFAULT true,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `companyId` VARCHAR(191) NOT NULL,
    `newsId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`honorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announcement` (
    `announcementId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `updatedId` VARCHAR(191) NOT NULL,
    `state` BOOLEAN NOT NULL DEFAULT true,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hits` INTEGER NOT NULL DEFAULT 0,
    `companyId` VARCHAR(191) NOT NULL,
    `file` LONGTEXT NULL,

    UNIQUE INDEX `announcement_title_key`(`title`),
    PRIMARY KEY (`announcementId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Api` (
    `apiId` VARCHAR(191) NOT NULL,
    `apiName` VARCHAR(191) NOT NULL,
    `apiPath` VARCHAR(191) NOT NULL,
    `methodId` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `groupId` VARCHAR(191) NULL,
    `state` BOOLEAN NOT NULL DEFAULT true,
    `requireAuth` BOOLEAN NOT NULL DEFAULT true,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `accountId` VARCHAR(191) NOT NULL,
    `updateId` VARCHAR(191) NULL,

    UNIQUE INDEX `Api_apiPath_methodId_key`(`apiPath`, `methodId`),
    PRIMARY KEY (`apiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleAndApi` (
    `RoleAndApiID` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `apiId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RoleAndApi_roleId_apiId_key`(`roleId`, `apiId`),
    PRIMARY KEY (`RoleAndApiID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `notificationId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NULL,
    `typeId` VARCHAR(191) NOT NULL,
    `levelId` VARCHAR(191) NOT NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `state` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`notificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificationReceiver` (
    `notificationReceiverId` VARCHAR(191) NOT NULL,
    `notificationId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `readAt` DATETIME(3) NULL,
    `receiveDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notificationReceiver_notificationId_idx`(`notificationId`),
    INDEX `notificationReceiver_receiverId_idx`(`receiverId`),
    PRIMARY KEY (`notificationReceiverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `adminInfo` ADD CONSTRAINT `adminInfo_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `adminAccount`(`accountId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminMenu` ADD CONSTRAINT `adminMenu_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `adminMenu`(`menuId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accountsAndRoles` ADD CONSTRAINT `accountsAndRoles_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `adminInfo`(`accountId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accountsAndRoles` ADD CONSTRAINT `accountsAndRoles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `adminRole`(`roleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleAndMenu` ADD CONSTRAINT `RoleAndMenu_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `adminRole`(`roleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleAndMenu` ADD CONSTRAINT `RoleAndMenu_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `adminMenu`(`menuId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sysDictionary` ADD CONSTRAINT `sysDictionary_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `sysDictionary`(`dictionaryId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleAndApi` ADD CONSTRAINT `RoleAndApi_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `adminRole`(`roleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleAndApi` ADD CONSTRAINT `RoleAndApi_apiId_fkey` FOREIGN KEY (`apiId`) REFERENCES `Api`(`apiId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `adminInfo`(`accountId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificationReceiver` ADD CONSTRAINT `notificationReceiver_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `notification`(`notificationId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificationReceiver` ADD CONSTRAINT `notificationReceiver_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `adminInfo`(`accountId`) ON DELETE CASCADE ON UPDATE CASCADE;
