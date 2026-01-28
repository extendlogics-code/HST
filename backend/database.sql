-- HST Database Export
-- Comprehensive schema for Help To Self Help Trust (HST)
-- MySQL Syntax

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('ADMIN','STAFF') DEFAULT 'STAFF',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `is_active`) VALUES ('Admin', 'admin@hst.org', '$2b$10$Ep99WBy7Z3PzHymFz6z7uO.R0hE9.vM/H5z6z7uO.R0hE9.vM/H5z', 'ADMIN', 1);

-- ----------------------------
-- Table structure for trust_settings
-- ----------------------------
CREATE TABLE IF NOT EXISTS `trust_settings` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `trust_name` varchar(255) DEFAULT 'Help To Self Help Trust',
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `pan_number` varchar(255) DEFAULT 'AAATH4490F',
  `reg_80g_no` varchar(255) DEFAULT 'AAATH4490FF20218',
  `authorized_signatory_name` varchar(255) DEFAULT 'Authorized Signatory',
  `authorized_signatory_designation` varchar(255) DEFAULT 'Managing Trustee',
  `signature_image_url` varchar(255) DEFAULT NULL,
  `seal_image_url` varchar(255) DEFAULT NULL,
  `certificate_prefix` varchar(255) DEFAULT 'HST-80G',
  `currency` varchar(255) DEFAULT 'INR',
  `logo_image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of trust_settings
-- ----------------------------
INSERT INTO `trust_settings` (`id`, `trust_name`, `pan_number`, `reg_80g_no`, `authorized_signatory_name`, `authorized_signatory_designation`) VALUES (1, 'Help To Self Help Trust', 'AAATH4490F', 'AAATH4490FF20218', 'Vivek Shankar', 'Managing Trustee');

-- ----------------------------
-- Table structure for donors
-- ----------------------------
CREATE TABLE IF NOT EXISTS `donors` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `donor_type` enum('INDIVIDUAL','CORPORATE','INTERNATIONAL','COMPANY') DEFAULT 'INDIVIDUAL',
  `donor_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text,
  `pan` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `cin` varchar(255) DEFAULT NULL,
  `registered_office_address` text,
  `corporate_office_address` text,
  `website_url` varchar(255) DEFAULT NULL,
  `authorized_signatory_name` varchar(255) DEFAULT NULL,
  `authorized_signatory_designation` varchar(255) DEFAULT NULL,
  `authorized_signatory_email` varchar(255) DEFAULT NULL,
  `authorized_signatory_phone` varchar(255) DEFAULT NULL,
  `board_resolution_ref` varchar(255) DEFAULT NULL,
  `csr_registration_number` varchar(255) DEFAULT NULL,
  `csr_financial_year` varchar(255) DEFAULT NULL,
  `nature_of_csr_contribution` varchar(255) DEFAULT NULL,
  `csr_act_reference` varchar(255) DEFAULT 'Section 135 of Companies Act, 2013',
  `schedule_vii_category` varchar(255) DEFAULT NULL,
  `ngo_type` varchar(255) DEFAULT NULL,
  `tax_id` varchar(255) DEFAULT NULL,
  `contact_person_name` varchar(255) DEFAULT NULL,
  `contact_person_designation` varchar(255) DEFAULT NULL,
  `funding_category` varchar(255) DEFAULT NULL,
  `funding_cycle_type` varchar(255) DEFAULT NULL,
  `cycle_duration` varchar(255) DEFAULT NULL,
  `grant_start_date` date DEFAULT NULL,
  `grant_end_date` date DEFAULT NULL,
  `funding_status` varchar(255) DEFAULT NULL,
  `is_duplicate` tinyint(1) DEFAULT '0',
  `category` enum('local','foreign') DEFAULT 'local',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for donations
-- ----------------------------
CREATE TABLE IF NOT EXISTS `donations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `donor_id` int UNSIGNED DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `donation_date` date NOT NULL,
  `payment_mode` varchar(255) NOT NULL,
  `transaction_ref` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `remarks` text,
  `created_by` int UNSIGNED DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  `type` enum('local','fcra') DEFAULT 'local',
  `is_direct_certificate` tinyint(1) DEFAULT '0',
  `csr_amount_sanctioned` decimal(15,2) DEFAULT NULL,
  `amount_released` decimal(15,2) DEFAULT NULL,
  `installment_details` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `donations_donor_id_foreign` (`donor_id`),
  KEY `donations_created_by_foreign` (`created_by`),
  CONSTRAINT `donations_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `donations_donor_id_foreign` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for certificate_counters
-- ----------------------------
CREATE TABLE IF NOT EXISTS `certificate_counters` (
  `year` int NOT NULL,
  `last_seq` int DEFAULT '0',
  PRIMARY KEY (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for certificates
-- ----------------------------
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `donation_id` int UNSIGNED DEFAULT NULL,
  `certificate_no` varchar(255) NOT NULL,
  `issue_date` date NOT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `status` enum('ISSUED','VOIDED') DEFAULT 'ISSUED',
  `void_reason` text,
  `issued_by` int UNSIGNED DEFAULT NULL,
  `issued_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificates_donation_id_unique` (`donation_id`),
  UNIQUE KEY `certificates_certificate_no_unique` (`certificate_no`),
  KEY `certificates_issued_by_foreign` (`issued_by`),
  CONSTRAINT `certificates_donation_id_foreign` FOREIGN KEY (`donation_id`) REFERENCES `donations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `certificates_issued_by_foreign` FOREIGN KEY (`issued_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for audit_logs
-- ----------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `actor_user_id` int UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `meta` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `audit_logs_actor_user_id_foreign` (`actor_user_id`),
  CONSTRAINT `audit_logs_actor_user_id_foreign` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for enquiries
-- ----------------------------
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `consent` tinyint(1) DEFAULT '0',
  `status` enum('NEW','IN_PROGRESS','RESOLVED','SPAM') DEFAULT 'NEW',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for impact_stats
-- ----------------------------
CREATE TABLE IF NOT EXISTS `impact_stats` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL DEFAULT 'Users',
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for partners
-- ----------------------------
CREATE TABLE IF NOT EXISTS `partners` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo_url` varchar(255) NOT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for hero_slides
-- ----------------------------
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `image_url` varchar(255) NOT NULL,
  `button_text` varchar(255) DEFAULT NULL,
  `button_url` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for website_sections
-- ----------------------------
CREATE TABLE IF NOT EXISTS `website_sections` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `section_key` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `subtitle` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `website_sections_section_key_unique` (`section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for website_about
-- ----------------------------
CREATE TABLE IF NOT EXISTS `website_about` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `experience_years` varchar(255) DEFAULT NULL,
  `features` json DEFAULT NULL,
  `button_text` varchar(255) DEFAULT NULL,
  `button_url` varchar(255) DEFAULT NULL,
  `origin_title` varchar(255) DEFAULT 'Origin of the Organization',
  `origin_content` text,
  `objectives_title` varchar(255) DEFAULT 'Main Objectives',
  `objectives` json DEFAULT NULL,
  `mission_title` varchar(255) DEFAULT 'Mission Statement',
  `mission_statement` text,
  `founder_name` varchar(255) DEFAULT NULL,
  `founder_title` varchar(255) DEFAULT 'Founder & Managing Trustee',
  `founder_bio` text,
  `founder_image_url` varchar(255) DEFAULT NULL,
  `founder_quote` text,
  `founder_degree` varchar(255) DEFAULT NULL,
  `trustee_name` varchar(255) DEFAULT NULL,
  `trustee_degree` varchar(255) DEFAULT NULL,
  `trustee_title` varchar(255) DEFAULT NULL,
  `trustee_message` text,
  `trustee_image` varchar(255) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for website_causes
-- ----------------------------
CREATE TABLE IF NOT EXISTS `website_causes` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `raised_amount` decimal(15,2) DEFAULT '0.00',
  `goal_amount` decimal(15,2) DEFAULT '0.00',
  `show_progress` tinyint(1) DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for website_news
-- ----------------------------
CREATE TABLE IF NOT EXISTS `website_news` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text,
  `excerpt` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `publish_date` date DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `show_popup` tinyint(1) DEFAULT '0',
  `category` varchar(255) DEFAULT 'General',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for website_cta
-- ----------------------------
CREATE TABLE IF NOT EXISTS `website_cta` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `button_text` varchar(255) DEFAULT NULL,
  `button_url` varchar(255) DEFAULT NULL,
  `background_type` varchar(255) DEFAULT 'gradient',
  `background_value` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for initiatives
-- ----------------------------
CREATE TABLE IF NOT EXISTS `initiatives` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL DEFAULT 'Activity',
  `location` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Ongoing',
  `description` text,
  `target_group` varchar(255) DEFAULT NULL,
  `key_impact` varchar(255) DEFAULT NULL,
  `foundation` varchar(255) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `initiatives_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for website_legalities
-- ----------------------------
CREATE TABLE IF NOT EXISTS `website_legalities` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `managing_trustee` varchar(255) DEFAULT NULL,
  `contact_person_label` varchar(255) DEFAULT 'Contact Person',
  `legal_status` varchar(255) DEFAULT NULL,
  `registration_number` varchar(255) DEFAULT NULL,
  `tax_exemption_label` varchar(255) DEFAULT '12AA/80G Certificate',
  `tax_exemption_value` varchar(255) DEFAULT NULL,
  `fcra_number` varchar(255) DEFAULT NULL,
  `pan_number` varchar(255) DEFAULT NULL,
  `ngo_darpan_id` varchar(255) DEFAULT NULL,
  `registered_office` varchar(255) DEFAULT NULL,
  `csr_number` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for website_header
-- ----------------------------
CREATE TABLE IF NOT EXISTS `website_header` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `logo_url` varchar(255) DEFAULT NULL,
  `announcement_text` varchar(255) DEFAULT NULL,
  `announcement_link` varchar(255) DEFAULT NULL,
  `show_announcement` tinyint(1) DEFAULT '1',
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `nav_links` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for website_footer
-- ----------------------------
CREATE TABLE IF NOT EXISTS `website_footer` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `logo_url` varchar(255) DEFAULT NULL,
  `about_text` text,
  `copyright_text` varchar(255) DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `twitter_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `quick_links` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for website_landing_page
-- ----------------------------
CREATE TABLE IF NOT EXISTS `website_landing_page` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `page_name` varchar(255) DEFAULT 'Landing Page',
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `content` text,
  `image_url` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT 'special-initiative',
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `website_landing_page_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for visitor_logs
-- ----------------------------
CREATE TABLE IF NOT EXISTS `visitor_logs` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` text,
  `path` varchar(255) DEFAULT NULL,
  `referer` varchar(255) DEFAULT NULL,
  `device_type` varchar(255) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for website_donate
-- ----------------------------
CREATE TABLE IF NOT EXISTS `website_donate` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `local_bank_details` json DEFAULT NULL,
  `fcra_bank_details` json DEFAULT NULL,
  `local_qr_code_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Initial Data Seeds
-- ----------------------------

-- Default Admin (password: admin123)
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `is_active`) VALUES
(1, 'HST Admin', 'admin@helptoselfhelptrust.org', '$2a$10$7R8jH6G1yY3vB9PzR0nUvO7v8G1yY3vB9PzR0nUvO7v8G1yY3vB9', 'ADMIN', 1);

-- Initial Trust Settings
INSERT IGNORE INTO `trust_settings` (`id`, `trust_name`, `address_line1`, `address_line2`, `city`, `state`, `pincode`, `phone`, `email`, `pan_number`, `reg_80g_no`, `authorized_signatory_name`, `authorized_signatory_designation`) VALUES
(1, 'Help To Self Help Trust', '53/27, Pope Andavar Street', 'Chetpet', 'Thiruvannamalai', 'Tamil Nadu', '606801', '+91 98650 86296', 'contact@helptoselfhelptrust.org', 'AAATH4490F', 'AAATH4490FF20218', 'Vivek Shankar', 'Managing Trustee');

-- Initial Website Sections
INSERT IGNORE INTO `website_sections` (`section_key`, `name`, `sort_order`, `subtitle`, `title`, `description`) VALUES
('hero', 'Hero Section', 1, NULL, NULL, NULL),
('about', 'About Us Section', 2, 'Our Approach', 'Fostering a Self-Sustaining Cycle of Change', 'Our approach is rooted in the belief that true empowerment comes from within the community.'),
('legalities', 'Legalities Section', 3, 'Official Compliance', 'Trust Legalities', ''),
('causes', 'Causes Section', 4, 'Recent Causes', 'Our Latest Causes', 'Invest in the future by supporting our ongoing initiatives for a better world.'),
('initiatives', 'Initiatives Section', 5, 'Empowering Communities', 'Our Core Programmes', ''),
('partners', 'Partners Section', 6, 'Our Network', 'Trusted by Partners', ''),
('cta', 'Volunteer CTA Section', 7, NULL, NULL, NULL),
('news', 'News & Articles Section', 8, 'Latest Updates', 'News & Articles', 'Stay updated with our latest activities and stories of impact.'),
('impact_stats', 'Impact Statistics Section', 9, NULL, NULL, NULL);

-- Initial Legalities Data
INSERT IGNORE INTO `website_legalities` (`id`, `managing_trustee`, `legal_status`, `registration_number`, `tax_exemption_value`, `fcra_number`, `pan_number`, `ngo_darpan_id`, `registered_office`) VALUES
(1, 'Vivek Shankar', 'Registered under Indian Trust Act 1882', '625/2000', 'AAATH4490FE20038 / AAATH4490FF20218', '76080066', 'AAATH4490F', 'TN/2017/0169112', '53/27, Pope Andavar Street, Chetpet, Thiruvannamalai, Tamil Nadu, India - 606801');

-- Initial Header & Footer
INSERT IGNORE INTO `website_header` (`id`, `announcement_text`, `contact_email`, `contact_phone`) VALUES
(1, 'Support our mission - Your contribution makes a difference!', 'contact@helptoselfhelptrust.org', '+91 98650 86296');

INSERT IGNORE INTO `website_footer` (`id`, `about_text`, `copyright_text`, `facebook_url`, `twitter_url`, `instagram_url`, `address`, `email`, `phone`) VALUES
(1, 'Help To Self Help Trust (HST) is a non-profit organization committed to empowering individuals and communities through education, health, and sustainable development initiatives.', '© 2026 Help To Self Help Trust. All rights reserved.', 'https://facebook.com/helptoselfhelptrust', 'https://twitter.com/hstindia', 'https://instagram.com/hstindia', 'No, 9/1 Annai Theresa Street, Nirmala Nagar, Chetpet, Thiruvannamalai - 606801', 'contact@helptoselfhelptrust.org', '+91 98650 86296, +91 87540 60638');

SET FOREIGN_KEY_CHECKS = 1;
