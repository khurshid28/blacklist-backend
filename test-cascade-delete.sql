-- Test script to verify CASCADE delete behavior
-- This script demonstrates that when a user is deleted, 
-- all their partner relationships are automatically deleted

-- Example test (don't run in production):
-- 1. Create test users
-- INSERT INTO User (name, surname, username, birthdate, phone, pinfl, gender) 
-- VALUES ('Test1', 'User1', 'test1', '01.01.2000', '+998901111111', '1234567890123456', true);
-- INSERT INTO User (name, surname, username, birthdate, phone, pinfl, gender) 
-- VALUES ('Test2', 'User2', 'test2', '01.01.2000', '+998902222222', '1234567890123457', true);

-- 2. Create partner relationship
-- INSERT INTO UserPartner (userId, partnerId) VALUES (1, 2);
-- INSERT INTO UserPartner (userId, partnerId) VALUES (2, 1);

-- 3. Check partners exist
-- SELECT * FROM UserPartner;

-- 4. Delete one user
-- DELETE FROM User WHERE id = 1;

-- 5. Verify partners are automatically deleted
-- SELECT * FROM UserPartner; 
-- Result: Both records should be gone due to CASCADE
