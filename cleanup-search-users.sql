-- Find all TelegramUser records with "Search User" fullname
SELECT id, telegramId, phone, firstName, lastName, fullname, username 
FROM TelegramUser 
WHERE fullname = 'Search User' 
   OR firstName = 'Search' 
   OR lastName = 'User'
ORDER BY createdAt DESC;

-- Update them to have empty names if they were set to our dummy values
-- UPDATE TelegramUser 
-- SET firstName = '', 
--     lastName = '', 
--     fullname = ''
-- WHERE (fullname = 'Search User' OR firstName = 'Search' OR lastName = 'User')
--   AND (firstName = 'Search' AND lastName = 'User');

-- After running above SELECT to see the data, uncomment and run the UPDATE
