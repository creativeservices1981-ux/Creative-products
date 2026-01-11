# 🪣 Create Storage Bucket - Step by Step Guide

## Why Manual Setup is Needed

Supabase storage buckets require manual creation through the dashboard for security. But don't worry - it takes just 2 minutes!

---

## 📋 Step-by-Step Instructions

### Step 1: Open Storage Page

**Click this link:** https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/storage/buckets

(This takes you directly to your storage buckets page)

---

### Step 2: Create New Bucket

1. **Click the green "New bucket" button** (top right)

2. **A form will appear. Fill in:**

   **Bucket name:**
   ```
   product-files
   ```
   
   **Public bucket:**
   ```
   ❌ UNCHECK THIS BOX (leave it unchecked)
   ```
   
   **File size limit:**
   ```
   ✅ CHECK THIS BOX
   Enter: 100
   ```
   
   **Allowed MIME types:**
   ```
   ✅ CHECK THIS BOX
   ```
   
   Then paste these types (copy all and paste):
   ```
   application/pdf
   application/zip
   application/x-zip-compressed
   application/vnd.ms-excel
   application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
   application/vnd.openxmlformats-officedocument.wordprocessingml.document
   application/msword
   image/jpeg
   image/png
   image/jpg
   image/webp
   image/gif
   video/mp4
   video/quicktime
   video/x-msvideo
   application/json
   text/plain
   application/octet-stream
   ```

3. **Click "Create bucket"**

---

### Step 3: Set Storage Policies (AUTOMATIC)

Once you create the bucket, **come back here and tell me "bucket created"**.

I'll then run a script to automatically add the required security policies!

---

## 🎯 What It Should Look Like

After clicking "New bucket", your form should have:

```
┌─────────────────────────────────────────┐
│ Create a new bucket                     │
├─────────────────────────────────────────┤
│ Name: product-files                     │
│ □ Public bucket (UNCHECKED)             │
│ ✓ File size limit: 100 MB               │
│ ✓ Allowed MIME types:                   │
│   application/pdf                        │
│   application/zip                        │
│   ... (all the types listed)            │
│                                          │
│ [Cancel]  [Create bucket]                │
└─────────────────────────────────────────┘
```

---

## ⚡ Quick Copy-Paste

**For MIME types field, copy this entire block:**

```
application/pdf
application/zip
application/x-zip-compressed
application/vnd.ms-excel
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
application/vnd.openxmlformats-officedocument.wordprocessingml.document
application/msword
image/jpeg
image/png
image/jpg
image/webp
image/gif
video/mp4
video/quicktime
video/x-msvideo
application/json
text/plain
application/octet-stream
```

---

## ✅ After Creation

Once you've created the bucket:

1. **Tell me:** "bucket created"
2. **I'll run a script** to add storage policies automatically
3. **You can start uploading products!**

---

## 🎬 Video-Style Instructions

```
Step 1: Click → https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/storage/buckets
   ↓
Step 2: Click "New bucket" button (green, top right)
   ↓
Step 3: Name it "product-files"
   ↓
Step 4: ❌ Uncheck "Public bucket"
   ↓
Step 5: ✅ Check "File size limit" → Enter 100
   ↓
Step 6: ✅ Check "Allowed MIME types" → Paste the list
   ↓
Step 7: Click "Create bucket"
   ↓
Step 8: Come back and say "bucket created"
   ↓
Step 9: I'll add policies automatically
   ↓
DONE! 🎉
```

---

## 🆘 Need Help?

**Can't find the button?**
- Make sure you're logged into Supabase
- Use the direct link above

**Form looks different?**
- That's OK! Just make sure:
  - Name: product-files
  - Public: Unchecked
  - Size limit: 100 MB

**Don't see MIME types option?**
- That's fine! You can skip it for now
- Just create the bucket and we'll add restrictions later

---

## ⏱️ Total Time: 2 Minutes

This is the ONLY manual step needed. Everything else I can automate!

**Ready? Click the link and create the bucket! 👆**

Then tell me "bucket created" and I'll finish the setup automatically.
