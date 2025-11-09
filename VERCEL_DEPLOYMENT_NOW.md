# Vercel Deployment - Step by Step (Current Screen)

## ⚠️ IMPORTANT: Fix Root Directory First!

**Current Issue:** Vercel detected `Backend` as root directory - this is WRONG!

**Why?** We need to deploy the ENTIRE project (frontend + backend), not just the backend.

---

## Step 1: Fix Root Directory

### On the Vercel "New Project" screen:

1. **Find "Root Directory" section** (should show `Backend`)
2. **Click the "Edit" button** next to it
3. **Clear the field** (make it empty) OR set it to `./`
4. **Click outside or press Enter** to save

**Why?** 
- Our `vercel.json` is at the root of the repository
- Our `api/index.js` is at the root
- Frontend is in `frontend/` directory
- Backend is in `Backend/` directory
- We need Vercel to see the entire structure

---

## Step 2: Verify Framework Preset

1. **Framework Preset:** Should be `Other` or `No Framework`
   - If it shows `Express`, that's okay, but `Other` is better for our setup
   - Our `vercel.json` will handle the configuration

---

## Step 3: Configure Build Settings (Expand "Build and Output Settings")

1. **Click to expand** "Build and Output Settings"

2. **Verify these settings:**
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install && cd Backend && npm install`
   - **Root Directory:** (should be empty/root)

   **Note:** If these fields are empty, that's fine - our `vercel.json` will provide them.

---

## Step 4: Add Environment Variables (CRITICAL!)

1. **Click to expand** "Environment Variables" section

2. **Add each variable one by one:**

### Variable 1: MONGO_URI
- **Name:** `MONGO_URI`
- **Value:** `mongodb+srv://user1:skypassword@cluster0.wifn1ms.mongodb.net/skyassist?retryWrites=true&w=majority`
- **Environment:** Check ALL boxes (Production, Preview, Development)
- Click **"Add"**

### Variable 2: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** Generate a secure random string (minimum 32 characters)
  - You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  - Or use a password generator
  - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`
- **Environment:** Check ALL boxes
- Click **"Add"**

### Variable 3: JWT_EXPIRE
- **Name:** `JWT_EXPIRE`
- **Value:** `7d`
- **Environment:** Check ALL boxes
- Click **"Add"**

### Variable 4: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Check ONLY "Production"
- Click **"Add"**

### Variable 5: FRONTEND_URL
- **Name:** `FRONTEND_URL`
- **Value:** `https://sky-assist-7x5x.vercel.app` (or your project name)
- **Environment:** Check ALL boxes
- Click **"Add"**
- **Note:** You'll update this after deployment with your actual URL

### Variable 6: RATE_LIMIT_WINDOW_MS
- **Name:** `RATE_LIMIT_WINDOW_MS`
- **Value:** `900000`
- **Environment:** Check ALL boxes
- Click **"Add"**

### Variable 7: RATE_LIMIT_MAX_REQUESTS
- **Name:** `RATE_LIMIT_MAX_REQUESTS`
- **Value:** `100`
- **Environment:** Check ALL boxes
- Click **"Add"**

---

## Step 5: Review Settings

Before clicking Deploy, verify:

✅ **Root Directory:** Empty or `./` (NOT `Backend`)
✅ **Framework Preset:** `Other` or `Express` (both work)
✅ **Build Command:** `cd frontend && npm install && npm run build` (or auto-detected)
✅ **Output Directory:** `frontend/dist` (or auto-detected)
✅ **Environment Variables:** All 7 variables added
✅ **Project Name:** `sky-assist-7x5x` (or your preferred name)

---

## Step 6: Deploy

1. **Click the white "Deploy" button** at the bottom
2. **Wait for deployment** (2-5 minutes)
3. **Monitor build logs** for any errors

---

## Step 7: After Deployment

### 7.1 Get Your Deployment URL

After deployment completes, you'll get a URL like:
- `https://sky-assist-7x5x.vercel.app`

### 7.2 Update FRONTEND_URL

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `FRONTEND_URL`
3. Click **"Edit"**
4. Update to your actual deployment URL
5. Click **"Save"**
6. Go to **Deployments** → Latest → **"..."** → **"Redeploy"**

### 7.3 Test Your Deployment

1. **Test API:** Visit `https://your-app.vercel.app/api/health`
   - Should return: `{"success":true,"message":"SkyAssist API is running",...}`

2. **Test Frontend:** Visit `https://your-app.vercel.app`
   - React app should load

3. **Test Registration:** Create a new user account

4. **Test Login:** Login with your credentials

---

## 🐛 Troubleshooting

### Issue: Build fails with "Cannot find module"

**Solution:** 
- Verify Root Directory is empty (not `Backend`)
- Check that `vercel.json` is at the repository root
- Verify `api/index.js` exists at root

### Issue: API returns 404

**Solution:**
- Check that `api/index.js` exists
- Verify `vercel.json` has correct rewrites
- Check function logs in Vercel dashboard

### Issue: Database connection fails

**Solution:**
- Verify `MONGO_URI` is set correctly
- Check MongoDB Atlas Network Access (should allow `0.0.0.0/0`)
- Verify database user credentials

### Issue: Frontend doesn't load

**Solution:**
- Check Build Command is: `cd frontend && npm install && npm run build`
- Check Output Directory is: `frontend/dist`
- Verify build logs for errors

---

## ✅ Quick Checklist

Before clicking Deploy:

- [ ] Root Directory is EMPTY (not `Backend`)
- [ ] All 7 environment variables are added
- [ ] MONGO_URI is correct (no spaces, with `/skyassist`)
- [ ] JWT_SECRET is set (long random string)
- [ ] Build Command points to frontend
- [ ] Output Directory is `frontend/dist`

---

## 🎯 Current Screen Actions

**Right now, on your Vercel screen:**

1. ✅ **Root Directory:** Click "Edit" → Clear it → Save
2. ✅ **Environment Variables:** Expand → Add all 7 variables
3. ✅ **Build Settings:** Expand → Verify settings (or leave auto-detected)
4. ✅ **Click "Deploy"**

---

**Ready to deploy! Follow the steps above and click Deploy when ready!** 🚀

