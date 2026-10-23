-- ==========================================================
-- Sona Luxury Hotel - Database Schema
-- Database: sona_hotel_db
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `sona_hotel_db`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `sona_hotel_db`;

-- ----------------------------------------------------------
-- 1. Admins / System Users Table
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` ENUM('superadmin', 'admin', 'receptionist') NOT NULL DEFAULT 'admin',
  `avatar` VARCHAR(255) DEFAULT 'default-avatar.png',
  `phone` VARCHAR(30) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. Rooms Table
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `category` ENUM('Deluxe', 'Family', 'Premium', 'Double', 'Suite') NOT NULL DEFAULT 'Deluxe',
  `price_per_night` DECIMAL(10, 2) NOT NULL,
  `size_sqft` INT NOT NULL DEFAULT 30,
  `capacity` INT NOT NULL DEFAULT 2,
  `bed_type` VARCHAR(60) NOT NULL DEFAULT 'King Beds',
  `services` VARCHAR(255) NOT NULL DEFAULT 'Wifi, Television, Bathroom, Air Conditioning',
  `description` TEXT NULL,
  `image_url` VARCHAR(255) NOT NULL DEFAULT 'img/room/room-1.jpg',
  `status` ENUM('available', 'booked', 'maintenance') NOT NULL DEFAULT 'available',
  `is_featured` TINYINT(1) NOT NULL DEFAULT 1,
  `total_rooms` INT NOT NULL DEFAULT 5,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. Bookings / Reservations Table
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_reference` VARCHAR(25) NOT NULL UNIQUE,
  `room_id` INT NOT NULL,
  `guest_name` VARCHAR(100) NOT NULL,
  `guest_email` VARCHAR(100) NOT NULL,
  `guest_phone` VARCHAR(30) NOT NULL,
  `check_in` DATE NOT NULL,
  `check_out` DATE NOT NULL,
  `adults` INT NOT NULL DEFAULT 1,
  `children` INT NOT NULL DEFAULT 0,
  `room_count` INT NOT NULL DEFAULT 1,
  `total_nights` INT NOT NULL DEFAULT 1,
  `total_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` ENUM('unpaid', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
  `payment_method` VARCHAR(50) DEFAULT 'Pay at Hotel',
  `special_requests` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bookings_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. Hotel Services / Amenities Table
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `icon_class` VARCHAR(60) NOT NULL DEFAULT 'flaticon-036-parking',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. Blog / News Posts Table
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `tag` VARCHAR(60) NOT NULL DEFAULT 'Travel',
  `author` VARCHAR(100) NOT NULL DEFAULT 'Hotel Admin',
  `image_url` VARCHAR(255) NOT NULL DEFAULT 'img/blog/blog-1.jpg',
  `excerpt` TEXT NULL,
  `content` LONGTEXT NULL,
  `published_date` DATE NOT NULL,
  `status` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  `views_count` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 6. Testimonials / Reviews Table
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `author_name` VARCHAR(100) NOT NULL,
  `author_title` VARCHAR(100) DEFAULT 'Guest',
  `content` TEXT NOT NULL,
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  `avatar_url` VARCHAR(255) DEFAULT 'img/testimonial-logo.png',
  `is_approved` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 7. Contact Inquiries Table
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(150) DEFAULT 'General Inquiry',
  `message` TEXT NOT NULL,
  `status` ENUM('unread', 'read', 'replied') NOT NULL DEFAULT 'unread',
  `reply_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 8. General Hotel Settings Table
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `hotel_settings`;
CREATE TABLE `hotel_settings` (
  `setting_key` VARCHAR(60) PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `group_name` VARCHAR(50) DEFAULT 'general',
  `description` VARCHAR(200) NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 9. Activity Log Table
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_activity_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
