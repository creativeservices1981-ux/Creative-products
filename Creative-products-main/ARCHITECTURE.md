# Digital Product Sales & Secure Delivery Platform - Architecture

## 🎯 System Overview

A full-stack platform for selling and securely delivering digital products with:
- Token-based secure access control
- Multiple product types (files, folders, links)
- Online & offline payment support
- Admin approval workflow
- Email-based delivery

---

## 📊 Database Schema

### 1. users (Supabase Auth)
```sql
- id: uuid (PK)
- email: text (unique)
- name: text
- role: text ('admin' | 'customer')
- created_at: timestamp
```

### 2. products
```sql
- id: uuid (PK)
- title: text
- description: text
- price: decimal
- delivery_type: text ('file_download' | 'folder' | 'google_drive_link' | 'external_url' | 'time_limited_access')
- storage_path: text (Supabase storage path or external URL)
- status: text ('active' | 'inactive')
- access_expiry_hours: integer (nullable, null = lifetime)
- download_limit: integer (nullable, null = unlimited)
- image_url: text (nullable, product thumbnail)
- created_at: timestamp
- updated_at: timestamp
```

### 3. orders
```sql
- id: uuid (PK)
- order_number: text (unique, format: ORD-YYYYMMDD-XXXXX)
- user_id: uuid (FK -> users.id)
- product_id: uuid (FK -> products.id)
- amount: decimal
- payment_mode: text ('online' | 'offline')
- payment_status: text ('pending' | 'paid' | 'failed')
- payment_id: text (nullable, Razorpay payment ID)
- created_at: timestamp
- updated_at: timestamp
```

### 4. deliveries
```sql
- id: uuid (PK)
- order_id: uuid (FK -> orders.id, unique)
- secure_token: text (unique, UUID)
- access_url: text (full URL with token)
- expires_at: timestamp (nullable)
- download_limit: integer (nullable)
- download_count: integer (default: 0)
- last_accessed_at: timestamp (nullable)
- revoked: boolean (default: false)
- created_at: timestamp
```

### 5. product_files (for multi-file products)
```sql
- id: uuid (PK)
- product_id: uuid (FK -> products.id)
- file_name: text
- storage_path: text
- file_size: integer
- file_type: text
- created_at: timestamp
```

---

## 🔄 Application Flows

### Customer Journey

```
1. Browse Products (/)
   ↓
2. View Product Details (/products/[id])
   ↓
3. Click "Buy Now" (requires login)
   ↓
4. Checkout Page (/checkout/[id])
   ↓
5. Select Payment Method:
   ├─ Online Payment → Razorpay → Webhook → Auto Delivery
   └─ Offline Payment → Order Created (Pending) → Wait for Admin
   ↓
6. Email Received with Secure Access Link
   ↓
7. Access Product (/access/[token])
   ├─ Validate Token
   ├─ Check User Email
   ├─ Check Expiry
   └─ Check Download Limits
   ↓
8. Download/View Product
   └─ Generate Signed URL (5 min expiry)
```

### Admin Workflow

```
1. Admin Dashboard (/admin/dashboard)
   ├─ View Stats (Sales, Orders, Revenue)
   ├─ Recent Orders
   └─ Top Products
   ↓
2. Product Management (/admin/products)
   ├─ Create New Product
   │  ├─ Upload Files to Supabase Storage
   │  ├─ Set Price & Access Rules
   │  └─ Activate Product
   ├─ Edit Existing Product
   └─ Delete/Deactivate Product
   ↓
3. Order Management (/admin/orders)
   ├─ View All Orders
   ├─ Filter by Status
   ├─ Approve Offline Payments
   │  └─ Trigger Delivery Email
   ├─ Resend Product Link
   └─ Revoke Access
```

---

## 🔐 Security Architecture

### Token-Based Access Control

```
Order Paid
  ↓
Generate Unique secure_token (UUID)
  ↓
Create Delivery Record
  ↓
Access URL: {BASE_URL}/access/{secure_token}
  ↓
Email Sent to Customer
  ↓
Customer Clicks Link
  ↓
Validate:
  ├─ Token exists?
  ├─ User email matches order?
  ├─ Not expired?
  ├─ Download limit not exceeded?
  └─ Not revoked?
  ↓
Generate Supabase Signed URL (5 min expiry)
  ↓
Download/View Product
  ↓
Log Access & Increment Count
```

### Row Level Security (RLS) Policies

```sql
-- Customers can only see their own orders
CREATE POLICY "customers_own_orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Customers can only access their own deliveries
CREATE POLICY "customers_own_deliveries" ON deliveries
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- Admin can see everything
CREATE POLICY "admin_all_access" ON orders
  FOR ALL USING (
    auth.jwt()->>'role' = 'admin'
  );
```

---

## 🎨 Frontend Structure

### Customer Pages
- `/` - Product Catalog (grid view with filters)
- `/products/[id]` - Product Detail Page
- `/checkout/[id]` - Checkout & Payment Selection
- `/my-purchases` - Purchase History with Access Links
- `/access/[token]` - Secure Product Access Page
- `/login` - Login Page
- `/signup` - Sign Up Page

### Admin Pages
- `/admin/dashboard` - Overview Stats & Recent Activity
- `/admin/products` - Product List (CRUD operations)
- `/admin/products/new` - Create New Product Form
- `/admin/products/[id]/edit` - Edit Product Form
- `/admin/orders` - Order Management & Approvals

---

## 🛠️ API Routes

### Public APIs
- `GET /api/products` - List active products
- `GET /api/products/[id]` - Get product details

### Authenticated APIs
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/deliveries/[token]` - Access product
- `GET /api/deliveries/[token]/download` - Download file

### Admin APIs
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - Get all orders
- `POST /api/admin/orders/[id]/approve` - Approve offline payment
- `POST /api/admin/orders/[id]/resend` - Resend delivery email
- `POST /api/admin/deliveries/[id]/revoke` - Revoke access
- `GET /api/admin/dashboard` - Get dashboard stats

### Webhook
- `POST /api/webhooks/razorpay` - Payment verification

---

## 📦 Product Delivery Types

### 1. File Download
- Single file upload to Supabase Storage
- Direct download via signed URL
- Examples: PDF, ZIP, Video, Image

### 2. Multiple File Bundle
- Multiple files linked to one product
- Download all as ZIP or individual files
- Examples: Template packs, toolkit bundles

### 3. Google Drive Link
- Store Google Drive URL in database
- Deliver link via email
- No local storage needed

### 4. External URL
- Private URL (course platform, notion, etc.)
- Deliver via email
- Examples: Course access, Notion templates

### 5. Time-Limited Access
- Generate temporary access token
- Auto-expire after set duration
- Examples: 24h course access, trial content

---

## 💳 Payment Flow

### Online Payment (Razorpay)

```
1. Customer clicks "Pay with Razorpay"
   ↓
2. Frontend calls Razorpay SDK
   ↓
3. Customer completes payment
   ↓
4. Razorpay webhook hits /api/webhooks/razorpay
   ↓
5. Verify payment signature
   ↓
6. Update order status to "paid"
   ↓
7. Create delivery record
   ↓
8. Send email with access link (Resend)
   ↓
9. Customer receives email
```

### Offline Payment

```
1. Customer selects "Offline Payment"
   ↓
2. Order created with status "pending"
   ↓
3. Customer notified to make payment
   ↓
4. Admin verifies payment externally
   ↓
5. Admin clicks "Approve & Send Product"
   ↓
6. Order status updated to "paid"
   ↓
7. Delivery record created
   ↓
8. Email sent with access link
```

---

## 📧 Email System (Resend)

### Email Templates

1. **Order Confirmation (Online Payment)**
   - Subject: Your order #{order_number} is confirmed!
   - Content: Product access link, expiry info, support

2. **Offline Payment Instructions**
   - Subject: Complete your payment for order #{order_number}
   - Content: Payment instructions, order details

3. **Product Delivery (Offline Approval)**
   - Subject: Your product is ready to download!
   - Content: Access link, expiry, download limits

4. **Access Link Resend**
   - Subject: Your product access link
   - Content: Resent access link

---

## 📈 MVP Implementation Phases

### Phase 1: Core Foundation (Priority)
✅ Supabase setup & database schema
✅ Authentication (login/signup)
✅ Product catalog (customer view)
✅ Product detail page
✅ Admin product management (CRUD)
✅ File upload to Supabase Storage
✅ Order creation (mock payment)
✅ Secure delivery system
✅ Download limit enforcement
✅ Admin dashboard with stats

### Phase 2: Payments & Email
- Razorpay integration
- Payment webhook handling
- Offline payment approval workflow
- Resend email integration
- Email template system

### Phase 3: Polish & Advanced
- Product search & filters
- Download history
- Access revocation UI
- Product analytics
- Customer notifications
- Admin activity logs

---

## 🔧 Technical Stack

- **Frontend**: Next.js 14+ (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth
- **Payments**: Razorpay
- **Email**: Resend
- **Hosting**: Kubernetes (Emergent Platform)

---

## 🚀 Deployment Checklist

### Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay (Phase 2)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Resend (Phase 2)
RESEND_API_KEY=

# App
NEXT_PUBLIC_BASE_URL=
```

### Supabase Storage Setup

1. Create bucket: `product-files`
2. Set public access: false
3. Enable RLS policies
4. Set max file size: 100MB

### Supabase Database Setup

1. Run migration SQL
2. Enable RLS on all tables
3. Create admin user with role='admin'
4. Test RLS policies

---

## 📝 Notes

- All file URLs must use signed URLs (no public access)
- Tokens are single-use or limited by download count
- Admin actions are logged for audit trail
- Email delivery is async (background job)
- Large files use chunked upload strategy
- All prices in INR (or configurable currency)

---

**Built for**: Maximum security, scalability, and user experience
**Designed by**: Emergent AI Agent
**Last Updated**: June 2025
