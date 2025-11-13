BEGIN;

TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

INSERT INTO products (name, category, description, image_urls, buy_price, rent_price, seller_email) VALUES
('Royal Blue Lehenga', 'women', 'A stunning lehenga with intricate gold embroidery.', ARRAY['https://picsum.photos/seed/lehenga/400/500']::text[], 450, 90, 'seller@peacock.com'),
('Emerald Green Sherwani', 'men', 'Elegant silk sherwani for weddings and special occasions.', ARRAY['https://picsum.photos/seed/sherwani/400/500']::text[], 500, 100, 'seller@peacock.com'),
('Ruby Red Saree', 'women', 'Classic Banarasi silk saree with a modern twist.', ARRAY['https://picsum.photos/seed/saree/400/500']::text[], 350, 75, 'seller@peacock.com'),
('Golden Jhumkas', 'jwellery', 'Traditional temple jewellery-style earrings.', ARRAY['https://picsum.photos/seed/jhumkas/400/500']::text[], 80, 20, 'seller@peacock.com'),
('Boys Kurta Pajama Set', 'kids-boys', 'Comfortable and stylish cotton kurta set for boys.', ARRAY['https://picsum.photos/seed/kurta/400/500']::text[], 120, 30, 'seller@peacock.com'),
('Girls Anarkali Dress', 'kids-girls', 'Flowy and vibrant anarkali for young girls.', ARRAY['https://picsum.photos/seed/anarkali/400/500']::text[], 150, 40, 'seller@peacock.com'),
('Embroidered Potli Bag', 'handbags', 'A beautiful potli bag to complete your traditional look.', ARRAY['https://picsum.photos/seed/potli/400/500']::text[], 60, 15, 'seller@peacock.com'),
('Classic Nehru Jacket', 'men', 'A versatile jacket that can be paired with any kurta.', ARRAY['https://picsum.photos/seed/nehru/400/500']::text[], 180, 45, 'seller@peacock.com'),
('Silver Diya Set', 'pooja-items', 'Exquisite silver-plated diyas for your pooja room.', ARRAY['https://picsum.photos/seed/diya/400/500']::text[], 150, 35, 'seller@peacock.com'),
('Embroidered Mojaris', 'shoes', 'Handcrafted traditional mojaris with intricate threadwork.', ARRAY['https://picsum.photos/seed/mojari/400/500']::text[], 95, 25, 'seller@peacock.com'),
('Kundan Necklace Set', 'jwellery', 'A stunning Kundan necklace with matching earrings.', ARRAY['https://picsum.photos/seed/kundan/400/500']::text[], 220, 55, 'seller@peacock.com'),
('Peacock Wall Art', 'home-decor', 'Vibrant metal wall art to adorn your living space.', ARRAY['https://picsum.photos/seed/wallart/400/500']::text[], 130, 40, 'seller@peacock.com');

INSERT INTO reviews (product_id, author, location, text, rating) VALUES
(1, 'Priya S.', 'New York, USA', 'The lehenga was absolutely breathtaking! I received so many compliments. The rental process was seamless.', 5),
(2, 'Aarav M.', 'London, UK', 'Peacock has an amazing collection. The sherwani I bought was of premium quality. Highly recommend!', 5),
(3, 'Sunita K.', 'Toronto, CA', 'I rented a saree for a family function and it was perfect. The customer service is top-notch.', 4),
(1, 'Rohan P.', 'Sydney, AU', 'Finally, a place for high-quality Indian wear abroad. My go-to for every occasion.', 5);

INSERT INTO users (name, email, password, phone_number, user_type) VALUES
('Priya Sharma', 'priya@example.com', '$2b$10$RYg5OtTSGTN/xGaxzwoXcO0jz5jPQI4X4nB0efe/xiIsaZU/1bXm', '555-123-4567', 'customer'),
('Rohan Patel', 'rohan@example.com', '$2b$10$RYg5OtTSGTN/xGaxzwoXcO0jz5jPQI4X4nB0efe/xiIsaZU/1bXm', '555-987-6543', 'customer'),
('Anita Rao', 'anita@example.com', '$2b$10$RYg5OtTSGTN/xGaxzwoXcO0jz5jPQI4X4nB0efe/xiIsaZU/1bXm', '555-321-7890', 'seller');
-- password for all seed users is "peacock123"

INSERT INTO orders (id, user_email, date, items, total, status, tracking_number, shipping_details) VALUES
('PCK-001', 'priya@example.com', NOW() - INTERVAL '14 days', '[{"product":{"id":1,"name":"Royal Blue Lehenga","category":"women","description":"A stunning lehenga with intricate gold embroidery.","imageUrls":["https://picsum.photos/seed/lehenga/400/500"],"buyPrice":450,"rentPrice":90},"quantity":1,"action":"rent"}]'::jsonb, 97.2, 'Delivered', 'TRACK12345', '{"fullName":"Priya Sharma","address":"123 Market St","city":"San Francisco","state":"CA","zipCode":"94103","country":"USA"}'),
('PCK-002', 'rohan@example.com', NOW() - INTERVAL '7 days', '[{"product":{"id":2,"name":"Emerald Green Sherwani","category":"men","description":"Elegant silk sherwani for weddings and special occasions.","imageUrls":["https://picsum.photos/seed/sherwani/400/500"],"buyPrice":500,"rentPrice":100},"quantity":1,"action":"buy"}]'::jsonb, 540, 'Processing', 'TRACK67890', '{"fullName":"Rohan Patel","address":"456 King St","city":"Seattle","state":"WA","zipCode":"98101","country":"USA"}');

COMMIT;
