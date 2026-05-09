-- EMS Database Schema Verification
-- Run this to confirm all tables and columns are correct

-- 1. Show all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. event_registrations columns (most critical)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'event_registrations' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. scan_logs columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'scan_logs' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. status_master values
SELECT * FROM status_master ORDER BY type, status_id;

-- 5. Roles
SELECT * FROM roles ORDER BY role_id;

-- 6. Record counts
SELECT 
  (SELECT COUNT(*) FROM events WHERE is_deleted = false) as active_events,
  (SELECT COUNT(*) FROM event_registrations WHERE is_deleted = false) as active_registrations,
  (SELECT COUNT(*) FROM participants WHERE is_deleted = false) as active_participants,
  (SELECT COUNT(*) FROM users WHERE is_deleted = false) as active_users,
  (SELECT COUNT(*) FROM scan_logs) as total_scans,
  (SELECT COUNT(*) FROM passes) as total_passes,
  (SELECT COUNT(*) FROM qr_codes) as total_qr_codes;
