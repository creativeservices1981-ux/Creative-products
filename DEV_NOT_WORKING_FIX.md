# "npm run dev" Not Working - Complete Fix Guide

## Problem
`npm run dev` is not starting the development server on Windows.

## Quick Fixes (Try in Order)

### Fix 1: Simple Dev Command (RECOMMENDED FOR WINDOWS)
The package.json has been updated. Now just run:
```bash
npm run dev
```

This will start the server on http://localhost:3000

### Fix 2: If Port 3000 is Already in Use
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F

# Try again
npm run dev
```

### Fix 3: Clear Cache and Reinstall
```bash
# Delete build folders
rmdir /s /q .next
rmdir /s /q node_modules

# Delete lock files
del package-lock.json
# OR if using yarn
del yarn.lock

# Reinstall
npm install
# OR
yarn install

# Try again
npm run dev
```

### Fix 4: Check .env File
Make sure your `.env` file exists in the root directory with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxqzeiisfaidhqweiqij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6-i6c0Vc3Wf5f-4llkGSvA_ST_z2M4C
SUPABASE_SERVICE_ROLE_KEY=b_secret_aDn830IzRNmWCZ_1R69qaw_kNS0z7F8
MONGODB_URI=mongodb://localhost:27017/digiprostore
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Fix 5: Use Alternative Command
If `npm run dev` still doesn't work, try:
```bash
# Direct Next.js command
npx next dev

# OR specify port
npx next dev --port 3000
```

## Common Errors and Solutions

### Error: "NODE_OPTIONS is not recognized"
✅ **FIXED** - Updated package.json to remove Linux-style NODE_OPTIONS

### Error: "Port 3000 is already in use"
```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: "Cannot find module 'next'"
```bash
npm install next@latest react@latest react-dom@latest
```

### Error: "EADDRINUSE"
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Try again
npm run dev
```

### Error: File watching issues
```bash
# Increase file watchers (PowerShell as Admin)
[System.Environment]::SetEnvironmentVariable('NODE_OPTIONS', '--max-old-space-size=4096', 'User')

# Restart terminal and try
npm run dev
```

## Verify It's Working

After starting successfully, you should see:
```
   ▲ Next.js 14.2.3
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

Then visit: http://localhost:3000

## Still Not Working?

### Check Prerequisites:
1. **Node.js version**: `node --version` (should be 18.17 or higher)
   ```bash
   node --version
   ```

2. **npm version**: `npm --version` (should be 9.0 or higher)
   ```bash
   npm --version
   ```

3. **Update if needed**:
   - Download from: https://nodejs.org/

### Try Clean Install:
```bash
# Backup your .env file first!
copy .env .env.backup

# Delete everything
rmdir /s /q .next
rmdir /s /q node_modules
del package-lock.json

# Fresh install
npm install

# Restore .env if needed
copy .env.backup .env

# Start
npm run dev
```

### Alternative: Use Yarn
```bash
# If npm keeps failing, try yarn
npm install -g yarn

# Use yarn instead
yarn install
yarn dev
```

## Windows-Specific Tips

1. **Run as Administrator** if you get permission errors
2. **Disable antivirus temporarily** (sometimes blocks file operations)
3. **Use PowerShell or CMD** (avoid Git Bash for npm commands)
4. **Close VS Code** before deleting node_modules (sometimes locks files)

## Quick Test After Fix
```bash
# Start dev server
npm run dev

# In browser, visit:
# http://localhost:3000

# You should see the homepage!
```

## Need More Help?
Share the exact error message you're seeing for specific help.
