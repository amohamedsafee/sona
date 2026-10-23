-- ==========================================================
-- Sona Luxury Hotel - Seed Initial Data
-- Database: sona_hotel_db
-- ==========================================================

USE `sona_hotel_db`;

-- ----------------------------------------------------------
-- 1. Default Admins (Password: admin123)
-- ----------------------------------------------------------
INSERT INTO `admins` (`username`, `email`, `password_hash`, `full_name`, `role`, `phone`)
VALUES
('admin', 'admin@sona.com', '$2b$10$R0nVBEJwh9ECrhWvlR7Vd.fkNRkRA0Wc.HLhdCuOTYKxlpMXns4dO', 'Master Administrator', 'superadmin', '+1 (12) 345 67890'),
('reception', 'reception@sona.com', '$2b$10$R0nVBEJwh9ECrhWvlR7Vd.fkNRkRA0Wc.HLhdCuOTYKxlpMXns4dO', 'Front Desk Staff', 'receptionist', '+1 (12) 345 67891');

-- ----------------------------------------------------------
-- 2. Rooms (Matching Sona template room catalog)
-- ----------------------------------------------------------
INSERT INTO `rooms` (`name`, `slug`, `category`, `price_per_night`, `size_sqft`, `capacity`, `bed_type`, `services`, `description`, `image_url`, `status`, `is_featured`, `total_rooms`)
VALUES
('Double Room', 'double-room', 'Double', 199.00, 30, 4, 'King Beds', 'Wifi, Television, Bathroom, Mini Bar', 'Spacious double room with contemporary decor, plush bedding, ambient lighting, and panoramic city views.', 'img/room/room-b1.jpg', 'available', 1, 8),
('Premium King Room', 'premium-king-room', 'Premium', 159.00, 35, 5, 'King Beds', 'Wifi, Television, Bathroom, Jacuzzi, Balcony', 'Experience luxury with an expansive suite featuring a king-size bed, private marble bath, and balcony.', 'img/room/room-b2.jpg', 'available', 1, 6),
('Deluxe Room', 'deluxe-room', 'Deluxe', 198.00, 32, 3, 'King Beds', 'Wifi, Television, Bathroom, Ocean View', 'Elegant deluxe room equipped with state-of-the-art entertainment and breathtaking sunset vista.', 'img/room/room-b3.jpg', 'available', 1, 10),
('Family Room', 'family-room', 'Family', 299.00, 45, 6, 'King & Twin Beds', 'Wifi, Television, Bathroom, Kitchenette', 'Designed for families, offering interconnected sleeping zones, baby-care facilities, and spacious lounge.', 'img/room/room-b4.jpg', 'available', 1, 4),
('Executive Presidential Suite', 'presidential-suite', 'Suite', 450.00, 65, 4, 'California King', 'Wifi, Television, Private Pool, Butler Service', 'The pinnacle of luxury with private elevator access, butler service, dedicated bar, and bespoke furnishings.', 'img/room/room-1.jpg', 'available', 1, 2),
('Classic Twin Room', 'classic-twin-room', 'Double', 139.00, 28, 2, '2 Twin Beds', 'Wifi, Television, Bathroom, Coffee Maker', 'Ideal for business or leisure travelers seeking comfortable twin bedding and modern work desk.', 'img/room/room-2.jpg', 'available', 0, 12);

-- ----------------------------------------------------------
-- 3. Hotel Services
-- ----------------------------------------------------------
INSERT INTO `services` (`title`, `description`, `icon_class`, `is_active`, `display_order`)
VALUES
('Travel Plan & Tours', 'Curated city excursions and bespoke transportation itineraries tailored to your holiday schedule.', 'flaticon-036-parking', 1, 1),
('Gourmet Catering Service', 'Fine dining experiences prepared by Michelin-starred culinary chefs directly in your suite or private salon.', 'flaticon-033-dinner', 1, 2),
('Professional Babysitting', 'Certified child care professionals delivering attentive, playful, and safe supervision around the clock.', 'flaticon-026-bed', 1, 3),
('Express Laundry & Valet', 'Premium eco-friendly dry cleaning and pressing with same-day return service to your wardrobe.', 'flaticon-024-towel', 1, 4),
('Hire Chauffeur & Driver', 'Luxury fleet of Mercedes and Rolls Royce vehicles with experienced multilingual chauffeurs.', 'flaticon-044-clock-1', 1, 5),
('Exclusive Bar & Lounge', 'Handcrafted cocktails, vintage cellar wines, and artisan appetizers served in an intimate setting.', 'flaticon-012-cocktail', 1, 6);

-- ----------------------------------------------------------
-- 4. Blog Posts
-- ----------------------------------------------------------
INSERT INTO `blog_posts` (`title`, `slug`, `tag`, `author`, `image_url`, `excerpt`, `content`, `published_date`, `status`)
VALUES
('Tremblant In Canada: A Winter Wonderland Experience', 'tremblant-in-canada', 'Travel Trip', 'Elena Vance', 'img/blog/blog-1.jpg', 'Discover breathtaking ski slopes, cozy chalet retreats, and alpine gastronomic adventures in Quebec.', 'Mont-Tremblant offers an enchanting blend of European charm and North American wilderness. From morning powder runs to fireside fondue evenings, this destination captivates every mountain enthusiast.', '2026-04-15', 'published'),
('Choosing A Static Caravan for Luxury Glamping', 'choosing-a-static-caravan', 'Camping', 'Marcus Thorne', 'img/blog/blog-2.jpg', 'Everything you need to know about contemporary luxury mobile lodging and bespoke stays.', 'Static caravans have evolved into architectural gems offering underfloor heating, solar-assisted amenities, and picture windows opening to untouched nature.', '2026-04-15', 'published'),
('Copper Canyon: The Dramatic Secret of Mexico', 'copper-canyon', 'Event', 'Sophia Chen', 'img/blog/blog-3.jpg', 'Deep ravines, indigenous crafts, and historical railway journeys through the Sierra Tarahumara.', 'Larger and deeper than the Grand Canyon, Copper Canyon beckons daring explorers with the iconic Chepe Express train winding along towering cliff faces.', '2026-04-21', 'published'),
('Trip To Iqaluit In Nunavut: A Canadian Arctic Journey', 'trip-to-iqaluit', 'Event', 'Elena Vance', 'img/blog/blog-wide.jpg', 'Witness the celestial aurora borealis, dog sledding trails, and rich Inuit cultural heritage.', 'Iqaluit stands as a vibrant beacon of northern traditions. In winter, endless twilight skies give way to swirling curtains of jade and violet light.', '2026-04-08', 'published'),
('Traveling To Barcelona: Modernisme & Mediterranean Vistas', 'traveling-to-barcelona', 'Travel', 'Julian Roy', 'img/blog/blog-10.jpg', 'From Gaudí masterpieces to seaside tapas strolls, embrace the vibrant spirit of Catalonia.', 'Barcelona seamlessly pairs architectural wonders like the Sagrada Família with laid-back beachside dining and thriving nocturnal culture.', '2026-04-12', 'published');

-- ----------------------------------------------------------
-- 5. Testimonials
-- ----------------------------------------------------------
INSERT INTO `testimonials` (`author_name`, `author_title`, `content`, `rating`, `avatar_url`, `is_approved`)
VALUES
('Alexander Vasquez', 'Chicago Resident', 'After a construction project took longer than expected, my husband, daughter, and I needed a place to stay. As a resident, we know our city well, and we absolutely adored our vacation stay at Sona Hotel. The hospitality was exceptional!', 5.0, 'img/room/avatar/avatar-1.jpg', 1),
('Brandon Kelley', 'Architect & Traveler', 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. The interior craftsmanship and serenity of the rooms blew us away. Sona sets the gold standard for luxury boutique hotels.', 4.5, 'img/room/avatar/avatar-2.jpg', 1),
('Claire Dupont', 'Travel Blogger', 'The concierge desk went above and beyond organizing our city tours. Impeccable breakfast spread and peaceful night rest. We will definitely return!', 5.0, 'img/testimonial-logo.png', 1);

-- ----------------------------------------------------------
-- 6. Sample Initial Bookings
-- ----------------------------------------------------------
INSERT INTO `bookings` (`booking_reference`, `room_id`, `guest_name`, `guest_email`, `guest_phone`, `check_in`, `check_out`, `adults`, `children`, `room_count`, `total_nights`, `total_amount`, `status`, `payment_status`, `payment_method`, `special_requests`)
VALUES
('BK-SONA-1001', 1, 'Johnathan Miller', 'j.miller@example.com', '+1 (555) 234-5678', '2026-10-25', '2026-10-28', 2, 0, 1, 3, 597.00, 'confirmed', 'paid', 'Credit Card', 'High floor room if available, extra pillows.'),
('BK-SONA-1002', 2, 'Victoria Sterling', 'v.sterling@example.com', '+1 (555) 987-6543', '2026-10-24', '2026-10-26', 2, 1, 1, 2, 318.00, 'checked_in', 'paid', 'Pay at Hotel', 'Late arrival expected around 9 PM.'),
('BK-SONA-1003', 4, 'Robert & Sarah Davies', 'rdavies@example.com', '+1 (555) 456-7890', '2026-10-29', '2026-11-02', 3, 2, 1, 4, 1196.00, 'pending', 'unpaid', 'Pay at Hotel', 'Need baby crib in bedroom.'),
('BK-SONA-1004', 3, 'Amara Patel', 'amara.p@example.com', '+1 (555) 345-6712', '2026-10-20', '2026-10-23', 2, 0, 1, 3, 594.00, 'checked_out', 'paid', 'Credit Card', 'Honeymoon stay, requested welcome fruits.');

-- ----------------------------------------------------------
-- 7. Sample Contact Inquiries
-- ----------------------------------------------------------
INSERT INTO `contact_messages` (`name`, `email`, `subject`, `message`, `status`)
VALUES
('Michael Chang', 'm.chang@example.com', 'Corporate Event Booking', 'Hello, we would like to inquire about booking 15 rooms and the conference hall for our executive retreat in November.', 'unread'),
('Sophia Turner', 'sophia.t@example.com', 'Wedding Reception Inquiry', 'Good afternoon, is the rooftop terrace available for an evening private reception on December 12th?', 'read'),
('David Wilson', 'dwilson@example.com', 'Airport Shuttle Service', 'Can you please confirm if the airport shuttle can accommodate 4 adults with heavy luggage upon flight arrival?', 'replied');

-- ----------------------------------------------------------
-- 8. Hotel Settings
-- ----------------------------------------------------------
INSERT INTO `hotel_settings` (`setting_key`, `setting_value`, `group_name`, `description`)
VALUES
('hotel_name', 'Sona Luxury Hotel & Resort', 'general', 'Official name of the property'),
('contact_email', 'info.colorlib@gmail.com', 'general', 'Public customer support email'),
('contact_phone', '(12) 345 67890', 'general', 'Primary reservation hotline'),
('address', '856 Cordia Extension Apt. 356, Lake, United States', 'general', 'Physical hotel location'),
('check_in_time', '15:00', 'policies', 'Standard check-in time'),
('check_out_time', '11:00', 'policies', 'Standard check-out time'),
('currency_symbol', '$', 'general', 'Currency symbol displayed to guests'),
('tax_rate_percent', '12', 'finance', 'Applicable local hospitality tax percentage');
