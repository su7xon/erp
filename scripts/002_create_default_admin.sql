-- Create default admin user
-- Password: admin123 (bcrypt hash)
-- You should change this password after initial setup

INSERT INTO admins (email, password_hash, name)
VALUES (
  'admin@example.com',
  '$2a$10$rQZ8Y8qX8qX8qX8qX8qX8uX8qX8qX8qX8qX8qX8qX8qX8qX8qX8qX',
  'System Administrator'
)
ON CONFLICT (email) DO NOTHING;

-- Note: The password hash above is a placeholder.
-- The actual hash will be generated when the admin first logs in or 
-- you can generate one using bcrypt with password 'admin123'
