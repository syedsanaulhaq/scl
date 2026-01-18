-- SCL Development Database Initialization Script

-- Use the scl_dev database
USE scl_dev;

-- Set character set
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create Users table (placeholder for Phase 2)
-- This will be created by Sequelize when backend starts
-- But we can initialize with basic structure here

CREATE TABLE IF NOT EXISTS `Users` (
  `id` CHAR(36) BINARY NOT NULL PRIMARY KEY COMMENT 'UUID',
  `email` VARCHAR(255) NOT NULL UNIQUE COMMENT 'User email',
  `password` VARCHAR(255) NOT NULL COMMENT 'Hashed password',
  `name` VARCHAR(255) COMMENT 'User full name',
  `role` ENUM('student', 'teacher', 'admin') DEFAULT 'student' COMMENT 'User role',
  `isActive` BOOLEAN DEFAULT true COMMENT 'Account active status',
  `lastLogin` DATETIME COMMENT 'Last login timestamp',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_active_role ON `Users`(`isActive`, `role`);

-- Insert seed data (optional)
-- You can add initial admin user here if needed

COMMIT;
