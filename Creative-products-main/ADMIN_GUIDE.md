# 🎯 Complete Admin Panel Guide - DigiProStore

## Step 1: Create Your Admin Account

### Option A: If You Haven't Signed Up Yet

1. **Go to:** https://digiloft.preview.emergentagent.com/signup
2. **Fill in the form:**
   - Name: Your Name
   - Email: your-email@example.com
   - Password: (minimum 6 characters)
3. **Click "Create Account"**
4. **Check your email** for verification (if enabled)

### Option B: Make Existing User Admin

If you already have an account, you need to make yourself admin:

1. **Find your user ID:**
   - Go to: https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/auth/users
   - Find your email and copy your User ID

2. **Run this SQL:**
   - Go to: https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/sql/new
   - Paste and run this (replace with your email):

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');

-- Verify it worked
SELECT up.id, up.name, up.role, au.email 
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE up.role = 'admin';
```

3. **Log out and log back in** to see admin features

---

## Step 2: Access Admin Dashboard

1. **Login:** https://digiloft.preview.emergentagent.com/login
2. **After login**, you'll see **"Admin Dashboard"** button in the header (top right)
3. **Click "Admin Dashboard"** to access

### Admin Dashboard Features:
- **Overview Stats:** Total products, orders, revenue, pending approvals
- **Quick Actions:**
  - Manage Products
  - Manage Orders
  - Add New Product

---

## Step 3: Setup Storage Bucket (REQUIRED for File Uploads)

Before uploading products, you MUST create a storage bucket:

### Create Storage Bucket:

1. **Go to:** https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/storage/buckets

2. **Click "New bucket"** button

3. **Configure:**
   - Name: `product-files`
   - Public bucket: ❌ **UNCHECK** (keep it private)
   - File size limit: 100 MB (or as needed)

4. **Click "Create bucket"**

5. **Set Policies:**
   - Go to the bucket → Click "Policies" tab
   - Click "New Policy"
   - Add these policies:

```sql
-- Policy 1: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-files');

-- Policy 2: Allow file viewing via signed URLs
CREATE POLICY "Anyone can view files via signed URLs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-files');

-- Policy 3: Allow authenticated users to update their files
CREATE POLICY "Authenticated users can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-files');
```

---

## Step 4: Add Your First Product

### Method 1: Via Admin Dashboard (Recommended)

1. **Go to Admin Dashboard:** https://digiloft.preview.emergentagent.com/admin/dashboard

2. **Click "Manage Products"** or **"Add New Product"**

3. **Fill in Product Details:**

   **Basic Information:**
   - **Product Title:** E.g., "Social Media Template Pack"
   - **Description:** Detailed description of your product
   - **Price (₹):** E.g., 999
   
   **Delivery Type:** Choose one:
   - `File Download` - Single file (PDF, ZIP, Video, etc.)
   - `Folder` - Multiple files
   - `Google Drive Link` - Link to Google Drive
   - `External URL` - Any external link
   - `Time Limited Access` - Temporary access

   **Product File/Link:**
   - If **File Download** or **Folder**: Click "Choose File" to upload
   - If **Google Drive** or **External URL**: Paste the link

   **Product Image (Optional):**
   - Upload a product thumbnail/cover image
   - Recommended size: 500x500px

   **Access Control (Optional):**
   - **Access Expiry (hours):** Leave empty for lifetime, or set hours (e.g., 24, 168)
   - **Download Limit:** Leave empty for unlimited, or set limit (e.g., 3, 5, 10)

4. **Click "Create Product"**

5. **Done!** Your product is now live

---

## Step 5: Managing Products

### View All Products

1. **Admin Dashboard → Manage Products**
2. You'll see a table with all your products

### Edit a Product

1. **Click the edit icon** (pencil) next to any product
2. Modify details
3. **Click "Update Product"**

### Activate/Deactivate Product

1. **Click the status badge** (active/inactive)
2. Product visibility toggles instantly

### Delete a Product

1. **Click the delete icon** (trash)
2. Confirm deletion
3. Product and orders will be removed

---

## Step 6: Managing Orders

### View Orders

1. **Admin Dashboard → Manage Orders**
2. You'll see two sections:
   - **Pending Approvals:** Orders awaiting your approval
   - **Completed Orders:** Successfully delivered orders

### Approve Offline Payment

When a customer places an order with "Offline Payment":

1. **Verify payment externally** (bank transfer, UPI, etc.)
2. **Click "Approve & Send Product"**
3. System will:
   - Mark order as "paid"
   - Create secure delivery token
   - Generate access link
   - Send email (Phase 2)
4. **Customer receives access** to download

### Order Details

Each order shows:
- Order number
- Customer name
- Product purchased
- Amount paid
- Payment mode (online/offline)
- Date and time

---

## Step 7: Product Types Explained

### 1. File Download (Single File)
**Best for:** PDFs, ZIPs, Videos, Images, Excel files

**How to upload:**
1. Select "File Download"
2. Click "Choose File"
3. Select your file (max 100MB)
4. Wait for upload to complete

**Delivery:** Customer gets direct download link

---

### 2. Multiple File Bundle (Folder)
**Best for:** Template packs, toolkits, multi-file products

**How to upload:**
1. **Create a ZIP file** containing all files
2. Select "Folder" type
3. Upload the ZIP file

**Delivery:** Customer downloads ZIP and extracts

---

### 3. Google Drive Link
**Best for:** Large files, collaborative content

**How to setup:**
1. Upload files to Google Drive
2. **Set sharing to "Anyone with the link"**
3. Copy the sharing link
4. Select "Google Drive Link"
5. Paste the link

**Delivery:** Customer gets the Google Drive link

---

### 4. External URL
**Best for:** Course platforms, Notion pages, private websites

**How to setup:**
1. Get the access URL from external platform
2. Select "External URL"
3. Paste the URL

**Delivery:** Customer gets the URL via email

---

### 5. Time Limited Access
**Best for:** Trial products, temporary access

**How to setup:**
1. Upload file or provide link
2. Set "Access Expiry" (hours)
3. After expiry, customer can't download

---

## Step 8: Testing Your Setup

### Test as Customer:

1. **Open incognito/private browser**
2. **Sign up** with different email
3. **Browse products**
4. **Purchase a product**
5. **Check "My Purchases"**
6. **Wait for admin approval** (you)

### Test as Admin (You):

1. **Go to Admin → Manage Orders**
2. **See pending order**
3. **Click "Approve & Send"**
4. **Go back to customer account**
5. **Click "Access"** in My Purchases
6. **Download the product**

---

## Step 9: Dashboard Statistics

Your admin dashboard shows:

- **Total Products:** Number of products in catalog
- **Total Orders:** All orders placed
- **Total Revenue:** Sum of paid orders (₹)
- **Pending Approvals:** Orders waiting for your action

---

## Step 10: Quick Reference URLs

### Admin URLs:
- **Dashboard:** https://digiloft.preview.emergentagent.com/admin/dashboard
- **All Products:** https://digiloft.preview.emergentagent.com/admin/products
- **Add Product:** https://digiloft.preview.emergentagent.com/admin/products/new
- **Manage Orders:** https://digiloft.preview.emergentagent.com/admin/orders

### Customer URLs:
- **Homepage:** https://digiloft.preview.emergentagent.com/
- **My Purchases:** https://digiloft.preview.emergentagent.com/my-purchases

---

## Common Issues & Solutions

### ❌ "Can't see Admin Dashboard button"
**Solution:** You're not admin yet. Run the SQL to make yourself admin (Step 1)

### ❌ "Failed to upload file"
**Solution:** Create the `product-files` bucket in Supabase Storage (Step 3)

### ❌ "Access token not working"
**Solution:** Make sure you approved the order first in Admin → Orders

### ❌ "Products not showing"
**Solution:** Make sure product status is "active"

---

## Tips for Success

1. ✅ **Start with 1-2 test products** to understand the flow
2. ✅ **Use clear product titles and descriptions**
3. ✅ **Add product images** for better conversion
4. ✅ **Set reasonable prices** in INR
5. ✅ **Test download links** before making products live
6. ✅ **Approve offline orders promptly**
7. ✅ **Keep track of customer emails** for support

---

## Video Tutorial (Coming Soon)

We're preparing video tutorials for:
- Admin panel walkthrough
- Product upload process
- Order management
- Customer journey

---

## Need Help?

- Check **README.md** for technical details
- Check **SETUP_GUIDE.md** for setup instructions
- Check **ARCHITECTURE.md** for system design

---

**You're all set to start selling digital products! 🚀**

Start with a test product and go through the full customer journey to understand the platform.
