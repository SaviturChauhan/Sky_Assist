# Complete Render Deployment Guide for SkyAssist

This guide will walk you through deploying your SkyAssist application to Render step by step.

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ A GitHub account
- ✅ A Render account (sign up at [render.com](https://render.com) - free tier available)
- ✅ A MongoDB Atlas account (free tier available)
- ✅ Your code pushed to GitHub

---

## Step 1: Prepare MongoDB Atlas (Database)

### 1.1 Get Your MongoDB Connection String

If you haven't already set up MongoDB Atlas:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if not done)
3. Create a database user
4. Whitelist IP addresses (add `0.0.0.0/0` to allow all IPs)
5. Get your connection string:
   ```
   mongodb+srv://user1:skypassword@cluster0.wifn1ms.mongodb.net/skyassist?retryWrites=true&w=majority
   ```

**Save this connection string** - you'll need it in Step 3!

---

## Step 2: Push Code to GitHub

### 2.1 Commit and Push Changes

```bash
cd "/Users/savi/Desktop/5th Sem/MINI/Sky_Assist"

# Add all changes
git add .

# Commit changes
git commit -m "Configure for Render deployment"

# Push to GitHub
git push origin main
```

Make sure your code is pushed to GitHub before proceeding.

---

## Step 3: Deploy Backend to Render

### 3.1 Sign Up / Login to Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"** or **"Sign In"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Render to access your GitHub account

### 3.2 Create New Web Service (Backend)

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Select **"SaviturChauhan/Sky_Assist"** from the list
   - Click **"Connect"**

### 3.3 Configure Backend Service

Fill in the following settings:

#### Basic Settings:
- **Name**: `skyassist-backend` (or any name you prefer)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `Backend` ⚠️ **IMPORTANT: Set this to `Backend`**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Environment Variables:

Click **"Add Environment Variable"** and add each one:

1. **MONGO_URI**
   - Key: `MONGO_URI`
   - Value: `mongodb+srv://user1:skypassword@cluster0.wifn1ms.mongodb.net/skyassist?retryWrites=true&w=majority`
   - (Use your actual connection string)

2. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: Generate a secure random string (minimum 32 characters)
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`
   - Generate one: Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **JWT_EXPIRE**
   - Key: `JWT_EXPIRE`
   - Value: `7d`

4. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

5. **PORT**
   - Key: `PORT`
   - Value: `10000`
   - (Render automatically sets this, but it's good to specify)

6. **FRONTEND_URL**
   - Key: `FRONTEND_URL`
   - Value: `https://skyassist-frontend.onrender.com` (you'll update this after frontend deployment)

7. **RATE_LIMIT_WINDOW_MS**
   - Key: `RATE_LIMIT_WINDOW_MS`
   - Value: `900000`

8. **RATE_LIMIT_MAX_REQUESTS**
   - Key: `RATE_LIMIT_MAX_REQUESTS`
   - Value: `100`

#### Plan:
- Select **"Free"** plan (or paid plan if you prefer)

### 3.4 Deploy Backend

1. Click **"Create Web Service"**
2. Render will start building and deploying your backend
3. Wait for deployment to complete (3-5 minutes)
4. Once deployed, you'll get a URL like: `https://skyassist-backend.onrender.com`
5. **Copy this URL** - you'll need it for the frontend!

### 3.5 Test Backend

1. Visit: `https://your-backend-url.onrender.com/api/health`
2. You should see: `{"success":true,"message":"SkyAssist API is running",...}`

---

## Step 4: Deploy Frontend to Render

### 4.1 Create Static Site (Frontend)

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository:
   - Select **"SaviturChauhan/Sky_Assist"** from the list
   - Click **"Connect"**

### 4.2 Configure Frontend Service

Fill in the following settings:

#### Basic Settings:
- **Name**: `skyassist-frontend` (or any name you prefer)
- **Branch**: `main`
- **Root Directory**: `frontend` ⚠️ **IMPORTANT: Set this to `frontend`**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

#### Environment Variables:

Click **"Add Environment Variable"** and add:

1. **VITE_API_URL**
   - Key: `VITE_API_URL`
   - Value: `https://skyassist-backend.onrender.com` (your backend URL from Step 3.4)
   - ⚠️ **Important**: Must start with `VITE_` for Vite to expose it

#### Plan:
- Select **"Free"** plan (or paid plan if you prefer)

### 4.3 Deploy Frontend

1. Click **"Create Static Site"**
2. Render will start building and deploying your frontend
3. Wait for deployment to complete (2-3 minutes)
4. Once deployed, you'll get a URL like: `https://skyassist-frontend.onrender.com`
5. **Copy this URL** - this is your frontend URL!

---

## Step 5: Update Environment Variables

### 5.1 Update Backend FRONTEND_URL

1. Go to Render Dashboard → Your Backend Service → **"Environment"**
2. Find `FRONTEND_URL`
3. Click **"Edit"**
4. Update value to your frontend URL: `https://skyassist-frontend.onrender.com`
5. Click **"Save Changes"**
6. Render will automatically redeploy

### 5.2 Verify Frontend VITE_API_URL

1. Go to Render Dashboard → Your Frontend Service → **"Environment"**
2. Verify `VITE_API_URL` is set to your backend URL
3. If not, add it and redeploy

---

## Step 6: Verify Deployment

### 6.1 Test Backend API

1. Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"success":true,"message":"SkyAssist API is running",...}`

2. Test other endpoints:
   - `https://your-backend-url.onrender.com/api/auth/register`
   - `https://your-backend-url.onrender.com/`

### 6.2 Test Frontend

1. Visit: `https://your-frontend-url.onrender.com`
2. The React app should load
3. Check browser console for any errors
4. Test user registration
5. Test user login

### 6.3 Test Full Flow

1. Register a new user on the frontend
2. Login with your credentials
3. Create a request
4. Check MongoDB Atlas to verify data is being saved

---

## 🐛 Troubleshooting

### Issue: Backend deployment fails

**Symptoms**: Build fails or service doesn't start

**Solutions**:
1. Check build logs in Render dashboard
2. Verify `Root Directory` is set to `Backend`
3. Verify `Start Command` is `npm start`
4. Check that all environment variables are set
5. Verify MongoDB connection string is correct

### Issue: Frontend can't connect to backend

**Symptoms**: API calls fail, CORS errors

**Solutions**:
1. Verify `VITE_API_URL` is set correctly in frontend environment variables
2. Verify `FRONTEND_URL` is set correctly in backend environment variables
3. Check backend CORS configuration
4. Verify backend URL is accessible: `https://your-backend-url.onrender.com/api/health`
5. Redeploy frontend after updating `VITE_API_URL`

### Issue: Database connection fails

**Symptoms**: Backend logs show database connection errors

**Solutions**:
1. Verify `MONGO_URI` is set correctly
2. Check MongoDB Atlas Network Access (should allow `0.0.0.0/0`)
3. Verify database user credentials
4. Check MongoDB Atlas cluster is running (not paused)

### Issue: Frontend build fails

**Symptoms**: Frontend deployment fails during build

**Solutions**:
1. Check build logs in Render dashboard
2. Verify `Root Directory` is set to `frontend`
3. Verify `Build Command` is `npm install && npm run build`
4. Verify `Publish Directory` is `dist`
5. Check that all dependencies are in `package.json`

### Issue: Environment variables not working

**Symptoms**: App uses default values instead of environment variables

**Solutions**:
1. Verify environment variables are set in Render dashboard
2. For frontend, make sure variables start with `VITE_`
3. Redeploy after adding/changing environment variables
4. Check variable names match exactly (case-sensitive)

---

## 📊 Monitoring and Logs

### View Logs

1. Go to Render Dashboard → Your Service
2. Click **"Logs"** tab
3. You'll see real-time logs from your service

### Monitor Performance

1. Go to Render Dashboard → Your Service
2. Click **"Metrics"** tab
3. View CPU, Memory, and Request metrics

---

## 🔄 Updating Your Deployment

### Automatic Deployments

Render automatically deploys when you push to GitHub:
- Push to `main` branch → Automatic deployment

### Manual Deployment

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Render will automatically detect and deploy

### Manual Redeploy

1. Go to Render Dashboard → Your Service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## ✅ Deployment Checklist

Before considering deployment complete, verify:

- [ ] MongoDB Atlas cluster is created and running
- [ ] Database user is created with correct permissions
- [ ] Network access allows `0.0.0.0/0`
- [ ] Connection string is saved and correct
- [ ] Code is pushed to GitHub
- [ ] Backend service is created on Render
- [ ] All backend environment variables are set
- [ ] Backend deployment is successful
- [ ] Backend API health check works: `/api/health`
- [ ] Frontend service is created on Render
- [ ] Frontend environment variables are set (`VITE_API_URL`)
- [ ] Frontend deployment is successful
- [ ] Frontend loads correctly
- [ ] `FRONTEND_URL` is updated in backend
- [ ] User registration works
- [ ] User login works
- [ ] Database connection is working
- [ ] No CORS errors in browser console
- [ ] API endpoints are accessible

---

## 🎉 Success!

Your SkyAssist application should now be live on Render!

**Your URLs**:
- **Backend**: `https://skyassist-backend.onrender.com`
- **Frontend**: `https://skyassist-frontend.onrender.com`

### Next Steps

1. Share your frontend URL with users
2. Set up custom domains (optional)
3. Monitor performance and errors
4. Set up alerts for errors
5. Consider adding analytics
6. Set up automated backups for MongoDB

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Deployment Guide](https://expressjs.com/en/advanced/best-practice-production.html)
- [React Deployment Guide](https://react.dev/learn/start-a-new-react-project#production-build)

---

## 💡 Tips

1. **Always test locally first** before deploying
2. **Keep environment variables secure** - never commit them to Git
3. **Monitor your MongoDB Atlas usage** - free tier has limits
4. **Set up error tracking** - consider adding Sentry or similar
5. **Use preview deployments** - test changes before merging to main
6. **Keep dependencies updated** - regularly update npm packages
7. **Monitor service logs** - check Render logs regularly for errors
8. **Free tier limitations**:
   - Services may spin down after 15 minutes of inactivity
   - First request after spin-down may be slow (cold start)
   - Consider upgrading to paid plan for always-on services

---

## 🔗 Important Notes

1. **Free Tier Limitations**: 
   - Services on free tier spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds (cold start)
   - Consider upgrading to paid plan for production use

2. **Environment Variables**:
   - Backend: Set in Render dashboard → Environment
   - Frontend: Must start with `VITE_` to be exposed to frontend code

3. **Root Directories**:
   - Backend: `Backend`
   - Frontend: `frontend`

4. **Build Commands**:
   - Backend: `npm install`
   - Frontend: `npm install && npm run build`

5. **Start Commands**:
   - Backend: `npm start`
   - Frontend: Not needed (static site)

---

**Need Help?** Check the troubleshooting section or refer to Render's documentation.

**Happy Deploying! 🚀**

