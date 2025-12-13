-- Fix existing full URLs to relative paths in database

-- Update User avatars
UPDATE User 
SET image = SUBSTRING(image, LOCATE('/uploads', image))
WHERE image LIKE 'http%';

-- Update Image URLs
UPDATE Image 
SET url = SUBSTRING(url, LOCATE('/uploads', url))
WHERE url LIKE 'http%';

-- Update Video URLs
UPDATE Video 
SET url = SUBSTRING(url, LOCATE('/uploads', url))
WHERE url LIKE 'http%';

-- Verify changes
SELECT 'Users with avatars:' as category, COUNT(*) as count FROM User WHERE image IS NOT NULL
UNION ALL
SELECT 'Images:', COUNT(*) FROM Image
UNION ALL
SELECT 'Videos:', COUNT(*) FROM Video;
