# Why API Folder is at Root Level

## The Structure

```
Sky_Assist/
├── api/              ← Vercel serverless function adapter (at root)
│   └── index.js     ← Just a thin wrapper (3 lines of code)
├── Backend/          ← Your actual backend code (Express app)
│   ├── server.js    ← Real backend logic
│   ├── controllers/
│   ├── models/
│   └── routes/
└── frontend/         ← React frontend
```

## Why API Folder Must Be at Root?

### 1. **Vercel's Convention**
   - Vercel **automatically detects** serverless functions in an `api/` folder at the **root level**
   - This is Vercel's standard convention - it looks for `api/` at the project root
   - If you put it elsewhere, Vercel won't automatically detect it

### 2. **What `api/index.js` Actually Is**
   ```javascript
   // This is just a deployment adapter (3 lines!)
   const app = require("../Backend/server");
   module.exports = app;
   ```
   - It's **NOT** your backend code
   - It's just a **thin wrapper** that loads your Express app
   - Think of it as a "deployment adapter" for Vercel
   - Your **actual backend code** stays in `Backend/` where it belongs

### 3. **Separation of Concerns**
   - **`api/index.js`** = Deployment infrastructure (Vercel adapter)
   - **`Backend/`** = Your application code (Express app)
   - This keeps deployment concerns separate from application code

### 4. **How It Works**
   1. User visits `https://yourapp.vercel.app/api/auth/login`
   2. Vercel routes it to `api/index.js` (serverless function)
   3. `api/index.js` loads `Backend/server.js` (your Express app)
   4. Express app handles the request
   5. Response is sent back

## Alternative: Move to Backend? (Not Recommended)

You *could* put it in `Backend/api/`, but then you'd need:
- More complex Vercel configuration
- Custom function definitions
- Less standard setup

**Not worth it** - the root-level `api/` folder is just 3 lines of code that acts as an adapter.

## Think of It This Way

```
api/index.js = "Hey Vercel, here's how to run my Express app"
Backend/     = "This is my actual application code"
```

The `api/` folder is like a "bridge" between Vercel's serverless infrastructure and your Express app. It needs to be at root so Vercel can find it easily.

## Summary

- ✅ **`api/` at root** = Vercel's standard convention
- ✅ **Just 3 lines of code** = Simple adapter/wrapper
- ✅ **Your backend code** = Still in `Backend/` where it belongs
- ✅ **Clear separation** = Deployment adapter vs. application code

This is the standard, recommended approach for deploying Express apps on Vercel! 🚀

