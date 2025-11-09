# Quick Render Deployment Steps

## 🚀 Step-by-Step Guide

### Step 1: MongoDB Atlas (Already Done ✅)
- Connection string: `mongodb+srv://user1:skypassword@cluster0.wifn1ms.mongodb.net/skyassist?retryWrites=true&w=majority`

---

### Step 2: Push Code to GitHub

```bash
cd "/Users/savi/Desktop/5th Sem/MINI/Sky_Assist"
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

---

### Step 3: Deploy Backend to Render

1. **Go to Render**: [render.com](https://render.com) → Sign up/Login with GitHub

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect repository: `SaviturChauhan/Sky_Assist`
   - Click "Connect"

3. **Configure Backend**:
   - **Name**: `skyassist-backend`
   - **Region**: Choose closest (e.g., Oregon)
   - **Branch**: `main`
   - **Root Directory**: `Backend` ⚠️ **IMPORTANT**
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. **Add Environment Variables**:
   - `MONGO_URI` = `mongodb+srv://user1:skypassword@cluster0.wifn1ms.mongodb.net/skyassist?retryWrites=true&w=majority`
   - `JWT_SECRET` = `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6` (or generate your own)
   - `JWT_EXPIRE` = `7d`
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `FRONTEND_URL` = `https://skyassist-frontend.onrender.com` (update after frontend deploy)
   - `RATE_LIMIT_WINDOW_MS` = `900000`
   - `RATE_LIMIT_MAX_REQUESTS` = `100`

5. **Deploy**: Click "Create Web Service"
6. **Wait**: 3-5 minutes for deployment
7. **Copy Backend URL**: `https://skyassist-backend.onrender.com` (or your custom URL)

---

### Step 4: Deploy Frontend to Render

1. **Create Static Site**:
   - Click "New +" → "Static Site"
   - Connect repository: `SaviturChauhan/Sky_Assist`
   - Click "Connect"

2. **Configure Frontend**:
   - **Name**: `skyassist-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: `Free`

3. **Add Environment Variable**:
   - `VITE_API_URL` = `https://skyassist-backend.onrender.com` (your backend URL from Step 3)
   - ⚠️ **Must start with `VITE_`**

4. **Deploy**: Click "Create Static Site"
5. **Wait**: 2-3 minutes for deployment
6. **Copy Frontend URL**: `https://skyassist-frontend.onrender.com` (or your custom URL)

---

### Step 5: Update Backend FRONTEND_URL

1. Go to Render Dashboard → Backend Service → "Environment"
2. Find `FRONTEND_URL`
3. Edit → Update to your frontend URL: `https://skyassist-frontend.onrender.com`
4. Save → Auto-redeploys

---

### Step 6: Test Deployment

1. **Test Backend**: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"success":true,"message":"SkyAssist API is running",...}`

2. **Test Frontend**: `https://your-frontend-url.onrender.com`
   - React app should load
   - Test registration and login

---

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Backend service created on Render
- [ ] Backend environment variables set
- [ ] Backend deployed successfully
- [ ] Backend URL copied
- [ ] Frontend service created on Render
- [ ] Frontend environment variable set (`VITE_API_URL`)
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied
- [ ] Backend `FRONTEND_URL` updated
- [ ] Backend API health check works
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Backend build fails | Check Root Directory is `Backend` |
| Frontend build fails | Check Root Directory is `frontend` |
| API connection fails | Verify `VITE_API_URL` is set correctly |
| CORS errors | Update `FRONTEND_URL` in backend |
| Database error | Check `MONGO_URI` is correct |

---

## 📝 Important Notes

1. **Root Directories**:
   - Backend: `Backend`
   - Frontend: `frontend`

2. **Environment Variables**:
   - Frontend variables must start with `VITE_`
   - Update `FRONTEND_URL` after frontend deployment

3. **Free Tier**:
   - Services spin down after 15 min inactivity
   - First request may be slow (cold start)

---

## 🎉 Success!

Your app is now live:
- **Backend**: `https://skyassist-backend.onrender.com`
- **Frontend**: `https://skyassist-frontend.onrender.com`

For detailed instructions, see: **RENDER_DEPLOYMENT_GUIDE.md**

