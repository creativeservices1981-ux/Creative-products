-- Insert Dummy Products for Testing
-- Run this in Supabase SQL Editor

INSERT INTO products (title, description, price, delivery_type, storage_path, status, image_url, access_expiry_hours, download_limit) VALUES
(
    'Social Media Reels Pack - Vol 1',
    'Complete collection of 50+ viral-ready Instagram and TikTok reels templates. Includes trending transitions, effects, and music sync templates. Perfect for content creators and influencers.',
    999.00,
    'file_download',
    'https://example.com/reels-pack-vol1.zip',
    'active',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=500&fit=crop',
    NULL,
    5
),
(
    'Canva Template Bundle - Business',
    '100+ professionally designed Canva templates for businesses. Includes social media posts, presentations, flyers, and branding materials. Fully customizable and easy to edit.',
    1499.00,
    'google_drive_link',
    'https://drive.google.com/drive/folders/example-business-templates',
    'active',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
    168,
    NULL
),
(
    'Ultimate Caption & Hashtag Pack',
    '500+ ready-to-use captions and 1000+ trending hashtags organized by niche. Perfect for Instagram, Facebook, and LinkedIn. Includes seasonal content and engagement-boosting formulas.',
    599.00,
    'file_download',
    'https://example.com/captions-hashtags.pdf',
    'active',
    'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=500&h=500&fit=crop',
    NULL,
    3
),
(
    'Entrepreneur Database - 10K Contacts',
    'Verified database of 10,000+ entrepreneur contacts with email addresses, business info, and social profiles. Perfect for B2B outreach and networking. Updated monthly.',
    2999.00,
    'file_download',
    'https://example.com/entrepreneur-database.xlsx',
    'active',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop',
    72,
    1
),
(
    'Complete SOP Template Pack',
    '50+ Standard Operating Procedure templates for various business processes. Includes HR, Sales, Marketing, and Operations SOPs. Fully editable in Word and Google Docs.',
    1299.00,
    'folder',
    'https://example.com/sop-templates-folder',
    'active',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=500&fit=crop',
    NULL,
    NULL
),
(
    'Video Editing Course - Beginner to Pro',
    'Complete video editing masterclass with lifetime access. Learn Adobe Premiere Pro, DaVinci Resolve, and mobile editing. 20+ hours of content with project files.',
    3999.00,
    'external_url',
    'https://courses.example.com/video-editing-pro',
    'active',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&h=500&fit=crop',
    NULL,
    NULL
),
(
    'ChatGPT Prompt Library - 500+ Prompts',
    'Massive collection of tested ChatGPT prompts for business, content creation, coding, and productivity. Organized by category with usage examples and templates.',
    799.00,
    'file_download',
    'https://example.com/chatgpt-prompts.pdf',
    'active',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=500&fit=crop',
    NULL,
    10
),
(
    'Stock Photo Bundle - 1000+ Images',
    'Premium royalty-free stock photos for commercial use. High-resolution images covering business, lifestyle, technology, and nature. Perfect for websites and marketing.',
    1999.00,
    'google_drive_link',
    'https://drive.google.com/drive/folders/example-stock-photos',
    'active',
    'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=500&h=500&fit=crop',
    NULL,
    5
),
(
    'Social Media Growth Toolkit',
    'Complete toolkit for growing your social media presence. Includes scheduling templates, growth strategies, analytics spreadsheets, and engagement tactics. For all major platforms.',
    899.00,
    'file_download',
    'https://example.com/social-growth-toolkit.zip',
    'active',
    'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=500&h=500&fit=crop',
    24,
    3
);

-- Verify the products were inserted
SELECT id, title, price, status FROM products ORDER BY created_at DESC;
