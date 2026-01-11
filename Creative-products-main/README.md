# 🚀 DigiProStore - Digital Product Sales & Secure Delivery Platform

A full-stack, production-ready platform for selling and securely delivering digital products with token-based access control, admin approval workflows, and comprehensive order management.

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** - Browse digital products with beautiful UI
- **Secure Checkout** - Purchase products with online/offline payment options
- **Purchase History** - View all orders and their status
- **Secure Access** - Token-based secure product delivery
- **Download Management** - Enforced download limits and access expiry

### 👨‍💼 Admin Features
- **Dashboard** - Overview of sales, orders, and revenue
- **Product Management** - Create, edit, delete, and manage products
- **Order Management** - Approve offline payments and manage deliveries
- **File Upload** - Upload products directly to secure Supabase Storage
- **Access Control** - Set download limits and expiry times
- **Status Management** - Activate/deactivate products

### 🔐 Security Features
- **Token-Based Access** - Unique UUID tokens for each delivery
- **Row Level Security** - Database-level security with Supabase RLS
- **Signed URLs** - Short-lived (5min) download URLs
- **Access Validation** - User verification, expiry checks, download limits
- **Private Storage** - All files stored privately in Supabase

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18
- **UI:** Tailwind CSS, shadcn/ui components
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Authentication:** Supabase Auth
- **Payments:** Razorpay (Phase 2)
- **Email:** Resend (Phase 2)

## 📦 Project Structure

```
/app
├── app/
│   ├── page.js                    # Homepage (Product Catalog)
│   ├── layout.js                  # Root layout with AuthProvider
│   ├── login/page.js              # Login page
│   ├── signup/page.js             # Signup page
│   ├── products/[id]/page.js      # Product detail page
│   ├── my-purchases/page.js       # Customer purchase history
│   ├── access/[token]/page.js     # Secure product access page
│   ├── admin/
│   │   ├── dashboard/page.js      # Admin dashboard with stats
│   │   ├── products/page.js       # Product management list
│   │   ├── products/new/page.js   # Create new product
│   │   └── orders/page.js         # Order management & approvals
│   └── api/[[...path]]/route.js   # API routes
├── lib/
│   └── supabase/
│       ├── client.js              # Supabase client (browser)
│       ├── server.js              # Supabase admin client (server)
│       └── auth.js                # Auth context and hooks
├── components/ui/                 # shadcn/ui components
├── supabase-schema.sql            # Database schema
├── SETUP_GUIDE.md                 # Detailed setup instructions
└── ARCHITECTURE.md                # System architecture docs
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and Yarn
- Supabase account and project

### 1. Environment Setup

The `.env` file is already configured with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxqzeiisfaidhqweiqij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_BASE_URL=https://digiloft.preview.emergentagent.com
```

### 2. Database Setup

✅ **Already completed** - Database schema has been executed in Supabase

Tables created:
- `products` - Digital products
- `orders` - Purchase orders
- `deliveries` - Secure access tokens
- `product_files` - Multi-file products
- `user_profiles` - User roles and info

### 3. Storage Bucket Setup

**Required:** Create the storage bucket for product files

1. Go to: https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/storage/buckets
2. Click **"New bucket"**
3. Name: `product-files`
4. Public: **UNCHECK** (keep private)
5. Click **"Create bucket"**

### 4. Create Admin User

1. Sign up at: https://digiloft.preview.emergentagent.com/signup
2. Go to Supabase SQL Editor
3. Run:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```
4. Log out and log back in

### 5. Install & Run

```bash
cd /app
yarn install
yarn dev
```

Access the app at: https://digiloft.preview.emergentagent.com

## 📖 User Guide

### For Customers

1. **Browse Products**
   - Visit homepage to see all active products
   - Click "View Details" for more information

2. **Make a Purchase**
   - Click "Purchase Now" on product page
   - Order created in "pending" status (awaiting admin approval)
   - Check "My Purchases" for order status

3. **Access Products**
   - Once admin approves, see "Access" button in "My Purchases"
   - Click "Access" to view secure download page
   - Download limits and expiry enforced

### For Admins

1. **Add Products**
   - Go to Admin Dashboard
   - Click "Manage Products" → "Add Product"
   - Upload product file/link
   - Set price, limits, expiry
   - Optionally add product image

2. **Approve Orders**
   - Go to "Manage Orders"
   - See pending offline payments
   - Click "Approve & Send Product"
   - Customer receives secure access

3. **Manage Products**
   - Edit product details
   - Toggle active/inactive status
   - Delete products
   - View product statistics

## 🔄 Payment & Email Integration (Phase 2)

Currently, the MVP supports **offline payment approval**. To add Razorpay and email:

### Required:
- Razorpay API Key ID & Secret
- Resend API Key

### Features to be added:
- Razorpay Checkout integration
- Payment webhook verification
- Automatic email delivery on purchase
- Email templates for confirmations
- Resend product links

## 🧪 Testing Checklist

### Customer Flow
- [ ] Sign up for new account
- [ ] Browse product catalog
- [ ] View product details
- [ ] Purchase a product
- [ ] Check purchase history
- [ ] Wait for admin approval
- [ ] Access product via secure token
- [ ] Test download limits
- [ ] Test access expiry (if set)

### Admin Flow
- [ ] Log in as admin
- [ ] View dashboard stats
- [ ] Create new product
- [ ] Upload product file
- [ ] Set price and limits
- [ ] View all products
- [ ] Edit existing product
- [ ] Approve pending order
- [ ] View completed orders
- [ ] Toggle product status

## 🔐 Security Best Practices

1. **Never share** `SUPABASE_SERVICE_ROLE_KEY` - it bypasses RLS
2. **Keep storage private** - Use signed URLs only
3. **Rotate tokens** - Regenerate delivery tokens if compromised
4. **Monitor access** - Check download counts and access logs
5. **Set expiry** - Use time limits for sensitive products
6. **Validate users** - Always verify user owns the order

## 🐛 Troubleshooting

### "Failed to upload file"
**Solution:** Create the `product-files` bucket in Supabase Storage

### "Admin Dashboard not showing"
**Solution:** Update your user role to 'admin' in database

### "Invalid access token"
**Solution:** Ensure order was approved by admin first

### "Download not starting"
**Solution:** Check file exists in Supabase Storage

### "Can't create product"
**Solution:** Verify you're logged in as admin

## 📊 Database Schema Overview

### Products Table
- Stores product information, pricing, delivery type
- Controls access limits and expiry

### Orders Table
- Tracks customer purchases
- Links to products and users
- Stores payment status

### Deliveries Table
- Secure access tokens (UUID)
- Download count tracking
- Expiry enforcement
- Revocation support

### User Profiles Table
- Extends Supabase auth.users
- Stores user role (admin/customer)
- Auto-created on signup

## 🎯 Roadmap

### Phase 1 (MVP) - ✅ COMPLETED
- [x] User authentication
- [x] Product catalog
- [x] Product management
- [x] File upload system
- [x] Order creation
- [x] Offline payment approval
- [x] Secure delivery
- [x] Download limits
- [x] Access expiry
- [x] Admin dashboard

### Phase 2 (Next)
- [ ] Razorpay integration
- [ ] Resend email delivery
- [ ] Automatic emails
- [ ] Email templates
- [ ] Product search
- [ ] Advanced filters

### Phase 3 (Future)
- [ ] Product bundles
- [ ] Subscription products
- [ ] Coupon codes
- [ ] GST invoices
- [ ] WhatsApp delivery
- [ ] Analytics dashboard
- [ ] Customer reviews

## 📝 API Endpoints

### Public
- `GET /api` - Health check
- `GET /api?path=products` - List products

### Authenticated
- `POST /api?path=orders` - Create order

### Admin
- `POST /api?path=products` - Create product
- `PUT /api?path=orders` - Update order status

## 🤝 Support

For issues or questions:
1. Check `SETUP_GUIDE.md` for detailed instructions
2. Review `ARCHITECTURE.md` for system design
3. Check troubleshooting section above

## 📄 License

This project is built for production use. All rights reserved.

---

**Live URL:** https://digiloft.preview.emergentagent.com
**Built with ❤️ using Next.js, Supabase, and shadcn/ui**
