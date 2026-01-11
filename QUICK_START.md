# 🚀 Quick Start: Access Admin Panel in 3 Steps

## Step 1: Create Your Account (2 minutes)

1. **Go to:** https://digiloft.preview.emergentagent.com/signup

2. **Fill in:**
   ```
   Name: Your Name
   Email: your@email.com
   Password: ••••••••
   ```

3. **Click "Create Account"**

---

## Step 2: Make Yourself Admin (1 minute)

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/sql/new

2. **Copy and paste this SQL** (replace with YOUR email):

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR-EMAIL-HERE@example.com');
```

3. **Click "RUN"**

4. **You should see:** "Success. No rows returned"

---

## Step 3: Access Admin Panel

1. **Logout** (if logged in)

2. **Login again:** https://digiloft.preview.emergentagent.com/login

3. **You'll now see "Admin Dashboard" button** in the top right!

4. **Click "Admin Dashboard"**

---

## 🎯 What You'll See in Admin Panel

### Dashboard Page:
```
┌─────────────────────────────────────────┐
│  Total Products    Total Orders         │
│       9                 0                │
│                                          │
│  Total Revenue    Pending Approvals     │
│      ₹0                 0                │
└─────────────────────────────────────────┘

Quick Actions:
[Manage Products] [Manage Orders] [Add New Product]
```

### Products Page:
- List of all 9 dummy products
- Edit, Delete, Activate/Deactivate buttons
- **"Add Product"** button at top

### Orders Page:
- Pending Approvals (customers waiting)
- Completed Orders (delivered products)

---

## 📤 Upload Your First Product

### Quick Method:

1. **Click "Add Product"** button

2. **Fill in:**
   ```
   Title: My First Digital Product
   Description: A cool template pack
   Price: 499
   Delivery Type: File Download
   ```

3. **Upload File:**
   - Click "Choose File"
   - Select a PDF/ZIP file
   - Wait for upload

4. **Click "Create Product"**

5. **Done!** Product is live

---

## ⚠️ Important: Create Storage Bucket First!

Before uploading files, you MUST:

1. Go to: https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/storage/buckets

2. Click "New bucket"

3. Name: `product-files`

4. Public: ❌ UNCHECK

5. Click "Create bucket"

**Without this bucket, file uploads will fail!**

---

## 🎥 Visual Flow

```
You (Admin) → Login → See "Admin Dashboard" button → Click
     ↓
Dashboard → Click "Add Product"
     ↓
Fill form → Upload file → Click "Create Product"
     ↓
Product appears in catalog!
```

---

## 🧪 Test the Full Flow

1. **Add a product** (as admin)
2. **Open incognito browser**
3. **Sign up as customer**
4. **Buy the product**
5. **Go back to admin**
6. **Approve the order**
7. **Customer can now download!**

---

## 📞 Need Help Right Now?

**Can't see Admin Dashboard?**
→ You didn't run the SQL to make yourself admin

**Can't upload files?**
→ You didn't create the storage bucket

**Products not showing?**
→ Make sure status is "active"

---

## 🎯 Your Next Steps

1. ✅ Sign up / Login
2. ✅ Run SQL to become admin
3. ✅ Create storage bucket
4. ✅ Access admin dashboard
5. ✅ Add your first product
6. ✅ Test as customer

**Total time: ~10 minutes**

---

**Ready? Let's start!** 🚀

Open this link in a new tab: https://digiloft.preview.emergentagent.com/signup
