-- SaaS Starter Platform - Seed Data
-- Sample data for testing and development

-- Insert sample users
INSERT INTO users (id, email, password_hash, first_name, last_name, email_verified, is_superadmin) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7xnd7yPNlC', 'Admin', 'User', TRUE, TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'john@acmecorp.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7xnd7yPNlC', 'John', 'Doe', TRUE, FALSE),
('550e8400-e29b-41d4-a716-446655440003', 'jane@acmecorp.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7xnd7yPNlC', 'Jane', 'Smith', TRUE, FALSE),
('550e8400-e29b-41d4-a716-446655440004', 'bob@techstart.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7xnd7yPNlC', 'Bob', 'Johnson', TRUE, FALSE);

-- Insert sample organizations
INSERT INTO organizations (id, name, slug, industry, company_size, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Acme Corporation', 'acme-corp', 'Technology', '50-100', '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440002', 'TechStart Inc', 'techstart', 'Software', '10-50', '550e8400-e29b-41d4-a716-446655440004');

-- Insert organization members
INSERT INTO organization_members (organization_id, user_id, role) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'owner'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'admin'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'owner');

-- Insert sample subscriptions
INSERT INTO subscriptions (organization_id, plan_id, plan_name, status, current_period_start, current_period_end) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'pro', 'Professional', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 month'),
('660e8400-e29b-41d4-a716-446655440002', 'starter', 'Starter', 'trialing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '14 days');

-- Insert sample feature flags
INSERT INTO feature_flags (flag_key, flag_name, description, is_enabled, rollout_percentage) VALUES
('advanced_analytics', 'Advanced Analytics', 'Enable advanced analytics dashboard', TRUE, 100),
('api_v2', 'API v2', 'New API version with improved performance', FALSE, 0),
('team_collaboration', 'Team Collaboration', 'Enhanced team collaboration features', TRUE, 50);

-- Insert sample activity logs
INSERT INTO activity_logs (organization_id, user_id, action_type, action_description) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'user.login', 'User logged in'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'team.invite', 'Invited new team member'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'settings.update', 'Updated organization settings');

-- Insert notification preferences
INSERT INTO notification_preferences (user_id) VALUES
('550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440004');
