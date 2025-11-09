# Complete Vercel Deployment Guide for SkyAssist

This guide will walk you through deploying your SkyAssist application to Vercel step by step.

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ A GitHub account
- ✅ A Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ A MongoDB Atlas account (free tier available)
- ✅ Node.js installed locally (for testing)

---

## Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email address

### 1.2 Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"FREE"** (M0) tier
3. Select a cloud provider and region (choose closest to you)
4. Give your cluster a name (e.g., "SkyAssist")
5. Click **"Create"** (takes 3-5 minutes)

### 1.3 Create Database User

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `skyassist_user`)
5. Click **"Autogenerate Secure Password"** or create your own
6. **IMPORTANT**: Save the username and password (you'll need it!)
7. Under "Database User Privileges", select **"Read and write to any database"**
8. Click **"Add User"**

### 1.4 Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - This allows Vercel's servers to connect to your database
4. Click **"Confirm"**

### 1.5 Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials
6. Add your database name at the end:
   ```
   mongodb+srv://skyassist_user:your_password@cluster0.xxxxx.mongodb.net/skyassist?retryWrites=true&w=majority
   ```
7. **Save this connection string** - you'll need it in Step 4!

---

## Step 2: Prepare Your Project

### 2.1 Verify Project Structure

Make sure your project has this structure:
```
Sky_Assist/
├── api/
│   └── index.js
├── Backend/
│   ├── server.js
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
├── package.json
└── vercel.json
```

### 2.2 Test Locally (Optional but Recommended)

```bash
# Test backend
cd Backend
npm install
npm run dev
# Should run on http://localhost:5000

# Test frontend (in a new terminal)
cd frontend
npm install
npm run dev
# Should run on http://localhost:5173
```

### 2.3 Create .gitignore (if not exists)

Make sure `.gitignore` includes:
```
node_modules/
.env
.env.local
.DS_Store
dist/
*.log
Backend/.env
frontend/.env
```

---

## Step 3: Push Code to GitHub

### 3.1 Initialize Git Repository

```bash
cd "/Users/savi/Desktop/5th Sem/MINI/Sky_Assist"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SkyAssist project ready for deployment"
```

### 3.2 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `skyassist` (or any name you prefer)
4. Description: "SkyAssist - In-Flight Assistance Platform"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### 3.3 Push Code to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/skyassist.git

# Replace YOUR_USERNAME with your actual GitHub username

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys
- Or use GitHub CLI: `gh auth login`

---

## Step 4: Deploy to Vercel

### 4.1 Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account

### 4.2 Import Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find and click **"Import"** next to your `skyassist` repository

### 4.3 Configure Project Settings

Vercel will auto-detect some settings, but verify:

- **Project Name**: `skyassist` (or your preferred name)
- **Framework Preset**: **Other** (or leave as auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: Leave blank (Vercel will auto-detect)

### 4.4 Configure Environment Variables

**IMPORTANT**: Add these environment variables before deploying!

Click **"Environment Variables"** and add each one:

#### Required Environment Variables:

1. **MONGO_URI**
   - Value: Your MongoDB Atlas connection string from Step 1.5
   - Example: `mongodb+srv://skyassist_user:password@cluster0.xxxxx.mongodb.net/skyassist?retryWrites=true&w=majority`
   - Environment: Production, Preview, Development (check all)

2. **JWT_SECRET**
   - Value: A long, random, secure string (minimum 32 characters)
   - Generate one: Use [random.org](https://www.random.org/strings/) or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`
   - Environment: Production, Preview, Development (check all)

3. **JWT_EXPIRE**
   - Value: `7d`
   - Environment: Production, Preview, Development (check all)

4. **NODE_ENV**
   - Value: `production`
   - Environment: Production only

5. **FRONTEND_URL**
   - Value: `https://your-app-name.vercel.app` (you'll update this after deployment)
   - For now, use: `https://skyassist.vercel.app` (or your project name)
   - Environment: Production, Preview, Development (check all)

6. **RATE_LIMIT_WINDOW_MS**
   - Value: `900000` (15 minutes in milliseconds)
   - Environment: Production, Preview, Development (check all)

7. **RATE_LIMIT_MAX_REQUESTS**
   - Value: `100`
   - Environment: Production, Preview, Development (check all)

### 4.5 Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (2-5 minutes)
3. You'll see build logs in real-time
4. Once complete, you'll get a deployment URL like: `https://skyassist-abc123.vercel.app`

---

## Step 5: Update Environment Variables After Deployment

### 5.1 Get Your Deployment URL

After deployment, Vercel will give you a URL like:
- `https://skyassist.vercel.app` (if you have a custom domain)
- `https://skyassist-abc123.vercel.app` (default Vercel URL)

### 5.2 Update FRONTEND_URL

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `FRONTEND_URL`
3. Click **"Edit"**
4. Update the value to your actual deployment URL
5. Click **"Save"**

### 5.3 Redeploy

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

---

## Step 6: Verify Deployment

### 6.1 Test API Health Endpoint

Visit: `https://your-app.vercel.app/api/health`

You should see:
```json
{
  "success": true,
  "message": "SkyAssist API is running",
  "timestamp": "2024-...",
  "environment": "production"
}
```

### 6.2 Test Frontend

Visit: `https://your-app.vercel.app`

- The React app should load
- You should see the login page
- No console errors in browser DevTools

### 6.3 Test User Registration

1. Click **"Register"** or **"Sign Up"**
2. Fill in the registration form
3. Submit the form
4. Check if user is created in MongoDB Atlas:
   - Go to MongoDB Atlas → Database → Browse Collections
   - You should see a `users` collection with your new user

### 6.4 Test User Login

1. Login with your registered credentials
2. You should be redirected to the dashboard
3. Check browser localStorage for `authToken` (should be present)

### 6.5 Test API Endpoints

Use browser DevTools → Network tab to verify API calls are working:
- `/api/auth/login` - Should return 200 OK
- `/api/requests` - Should return requests (if any)
- `/api/announcements` - Should return announcements

---

## Step 7: Set Up Custom Domain (Optional)

### 7.1 Add Custom Domain in Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Enter your domain (e.g., `skyassist.com`)
3. Click **"Add"**
4. Follow the instructions to update your DNS records

### 7.2 Update Environment Variables

1. Update `FRONTEND_URL` to your custom domain
2. Redeploy the application

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Symptoms**: Build fails in Vercel dashboard

**Solutions**:
1. Check build logs for specific errors
2. Verify `package.json` files are correct
3. Make sure all dependencies are listed in `package.json`
4. Check Node.js version (should be >=16.0.0)
5. Verify `vercel.json` configuration is correct

### Issue: API Returns 404

**Symptoms**: `/api/health` returns 404

**Solutions**:
1. Verify `api/index.js` exists at root level
2. Check `vercel.json` routes configuration
3. Verify `Backend/server.js` exports the app correctly
4. Check function logs in Vercel dashboard

### Issue: Database Connection Fails

**Symptoms**: API returns database connection errors

**Solutions**:
1. Verify `MONGO_URI` is set correctly in Vercel environment variables
2. Check MongoDB Atlas Network Access (should allow `0.0.0.0/0`)
3. Verify database user credentials are correct
4. Check MongoDB Atlas cluster is running (not paused)
5. Verify connection string format is correct

### Issue: CORS Errors

**Symptoms**: Browser console shows CORS errors

**Solutions**:
1. Verify `FRONTEND_URL` matches your actual Vercel deployment URL
2. Check `Backend/server.js` CORS configuration
3. Redeploy after updating `FRONTEND_URL`
4. Clear browser cache and try again

### Issue: Environment Variables Not Working

**Symptoms**: App uses default values instead of environment variables

**Solutions**:
1. Verify environment variables are set in Vercel dashboard
2. Make sure you selected all environments (Production, Preview, Development)
3. Redeploy after adding/changing environment variables
4. Check variable names match exactly (case-sensitive)

### Issue: Frontend Can't Connect to API

**Symptoms**: Frontend loads but API calls fail

**Solutions**:
1. Check `frontend/src/services/api.js` - should use relative URLs in production
2. Verify API routes are working: `https://your-app.vercel.app/api/health`
3. Check browser console for specific error messages
4. Verify CORS is configured correctly

---

## 📊 Monitoring and Logs

### View Function Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on a deployment
3. Click **"Functions"** tab
4. Click on a function to see logs

### View Real-Time Logs

1. Go to Vercel Dashboard → Your Project → **Logs**
2. You'll see real-time logs from your serverless functions

### Monitor Performance

1. Go to Vercel Dashboard → Your Project → **Analytics**
2. View metrics like:
   - Request count
   - Response times
   - Error rates
   - Function execution times

---

## 🔄 Updating Your Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

### Manual Deployment

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Vercel will automatically detect and deploy

### Rollback Deployment

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Find the deployment you want to roll back to
3. Click **"..."** menu → **"Promote to Production"**

---

## ✅ Deployment Checklist

Before considering deployment complete, verify:

- [ ] MongoDB Atlas cluster is created and running
- [ ] Database user is created with correct permissions
- [ ] Network access allows `0.0.0.0/0`
- [ ] Connection string is saved and correct
- [ ] Code is pushed to GitHub
- [ ] Vercel project is created
- [ ] All environment variables are set in Vercel
- [ ] Build completes successfully
- [ ] API health endpoint works: `/api/health`
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Database connection is working
- [ ] No CORS errors in browser console
- [ ] API endpoints are accessible

---

## 🎉 Success!

Your SkyAssist application should now be live on Vercel!

**Your deployment URL**: `https://your-app.vercel.app`

### Next Steps

1. Share your deployment URL with users
2. Set up a custom domain (optional)
3. Monitor performance and errors
4. Set up alerts for errors
5. Consider adding analytics
6. Set up automated backups for MongoDB

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)
- [React Deployment Guide](https://react.dev/learn/start-a-new-react-project#production-build)

---

## 💡 Tips

1. **Always test locally first** before deploying
2. **Keep environment variables secure** - never commit them to Git
3. **Monitor your MongoDB Atlas usage** - free tier has limits
4. **Set up error tracking** - consider adding Sentry or similar
5. **Use preview deployments** - test changes before merging to main
6. **Keep dependencies updated** - regularly update npm packages
7. **Monitor function logs** - check Vercel logs regularly for errors

---

**Need Help?** Check the troubleshooting section or refer to Vercel's documentation.

**Happy Deploying! 🚀**

