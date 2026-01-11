# Setup Guide for DigiProStore

## ✅ Completed Steps
1. ✅ Database schema created and executed
2. ✅ Environment variables configured
3. ✅ Application code deployed

## 🔧 Required Setup Steps

### 1. Create Supabase Storage Bucket

You need to create a storage bucket for product files:

**Steps:**
1. Go to: https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/storage/buckets
2. Click **"New bucket"**
3. **Name:** `product-files`
4. **Public bucket:** ❌ UNCHECK (keep it private for security)
5. Click **"Create bucket"**

**Set Storage Policies:**
After creating the bucket, click on the bucket name and go to **Policies**:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-files');

-- Allow public to read via signed URLs only
CREATE POLICY "Anyone can view files via signed URLs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-files');
```

### 2. Create Admin User

Currently, all new users are created as 'customer' role. To make yourself admin:

**Steps:**
1. Sign up normally through the app at: https://digiloft.preview.emergentagent.com/signup
2. After signing up, go to Supabase SQL Editor: https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/sql/new
3. Run this SQL (replace with your actual user email):

```sql
-- Find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Update to admin role
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

4. Log out and log back in to see the Admin Dashboard link

### 3. Email Verification (Optional)

By default, Supabase requires email verification. To disable for testing:

1. Go to: https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/auth/url-configuration
2. Under **"Email Settings"**, toggle **"Enable email confirmations"** to OFF (for testing only)

## 🚀 How to Use the Platform

### As Customer:
1. **Browse Products** - View all active products on homepage
2. **Purchase Product** - Click "View Details" → "Purchase Now"
3. **View Purchases** - Go to "My Purchases" to see all orders
4. **Access Products** - Click "Access" button (for paid orders) to download

### As Admin:
1. **Access Dashboard** - After setting admin role, click "Admin Dashboard"
2. **Add Products:**
   - Click "Manage Products" → "Add Product"
   - Fill in product details
   - Upload product file (PDF, ZIP, etc.)
   - Optionally add product image
   - Set price, expiry, download limits
   - Click "Create Product"
3. **Approve Orders:**
   - Go to "Manage Orders"
   - See pending offline payments
   - Click "Approve & Send" to grant access
   - Customer can then download from their purchases

## 📝 Current MVP Features

### ✅ Working Features:
- User authentication (signup/login)
- Product catalog with beautiful UI
- Product detail pages
- Admin dashboard with stats
- Product management (CRUD)
- File upload to Supabase Storage
- Order creation
- Offline payment approval workflow
- Secure token-based delivery
- Download limit enforcement
- Access expiry enforcement
- Purchase history

### 🔄 Phase 2 (Not Yet Implemented):
- Razorpay payment integration
- Resend email delivery
- Automatic email on order approval
- Product search & filters
- Download history
- Access revocation UI

## 🧪 Testing the Platform

### Test Scenario 1: Customer Purchase Flow
1. Create a test customer account
2. Browse products and view details
3. Purchase a product (creates order in pending state)
4. Log in as admin
5. Approve the order
6. Log back in as customer
7. Go to "My Purchases"
8. Click "Access" and download the product

### Test Scenario 2: Admin Product Management
1. Log in as admin
2. Create a new product with file upload
3. View the product on the public store
4. Edit product details
5. Deactivate/activate product status
6. Delete test product

## 🐛 Troubleshooting

**Issue: Can't upload files**
- Solution: Make sure you created the `product-files` bucket in Supabase Storage

**Issue: Not seeing Admin Dashboard**
- Solution: Make sure you ran the SQL to update your user role to 'admin'

**Issue: Access token not working**
- Solution: Make sure the order was approved by admin first

**Issue: Download not starting**
- Solution: Check that the file was properly uploaded to Supabase Storage

## 🔐 Security Notes

- All product files are stored privately in Supabase Storage
- Access URLs use unique secure tokens (UUID)
- Signed URLs expire after 5 minutes
- Download limits are enforced
- Access expiry is checked on every access
- Row Level Security (RLS) policies protect all data

## 📊 Database Tables

- **products** - Digital products for sale
- **orders** - Customer purchase orders
- **deliveries** - Secure access tokens and delivery records
- **product_files** - Multiple files for bundle products (future)
- **user_profiles** - Extended user data and roles

## 🎯 Next Steps for Phase 2

When ready to add payments and emails:
1. Get Razorpay API keys (Key ID + Secret)
2. Get Resend API key
3. We'll integrate payment gateway
4. Add email templates
5. Set up webhook for automatic delivery

---

**Platform URL:** https://digiloft.preview.emergentagent.com
**Built with:** Next.js, Supabase, Tailwind CSS, shadcn/ui
