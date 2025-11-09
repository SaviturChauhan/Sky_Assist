# Build Error Fix - Vite Command Not Found

## The Problem

**Error:** `vite: command not found`

**Cause:** Frontend dependencies (including `vite` which is in `devDependencies`) were not being installed during the Vercel build process.

## The Solution

Updated `vercel.json` to ensure frontend dependencies are installed in the `installCommand`:

### Before (Broken):

```json
{
  "installCommand": "npm install && cd Backend && npm install",
  "buildCommand": "cd frontend && npm install && npm run build"
}
```

**Issue:** Frontend dependencies were only installed in `buildCommand`, but Vercel might run them in a way that doesn't preserve the installation.

### After (Fixed):

```json
{
  "installCommand": "npm install && cd Backend && npm install && cd ../frontend && npm install",
  "buildCommand": "cd frontend && npm run build"
}
```

**Fix:**

- Frontend dependencies are now installed in `installCommand` (along with root and backend)
- `buildCommand` just runs the build (dependencies are already installed)
- This ensures `vite` is available when `npm run build` executes

## What Changed

1. **installCommand** now includes: `cd ../frontend && npm install`

   - This installs all frontend dependencies including `vite` (devDependency)
   - Happens before the build step

2. **buildCommand** simplified to: `cd frontend && npm run build`
   - Dependencies are already installed
   - Just runs the build script

## Next Steps

1. **Commit and push the fix:**

   ```bash
   git add vercel.json
   git commit -m "Fix Vercel build: ensure frontend dependencies are installed"
   git push origin main
   ```

2. **Redeploy on Vercel:**
   - Vercel will automatically detect the new commit
   - Or manually trigger a redeploy in Vercel dashboard
   - The build should now succeed

## Verification

After redeploying, the build should:

1. ✅ Install root dependencies
2. ✅ Install backend dependencies
3. ✅ Install frontend dependencies (including vite)
4. ✅ Build frontend successfully
5. ✅ Deploy both frontend and backend

## Alternative Solution (If Still Fails)

If the issue persists, you can also try:

### Option 1: Use npx explicitly

```json
{
  "buildCommand": "cd frontend && npm install && npx vite build"
}
```

### Option 2: Use npm ci (more reliable)

```json
{
  "buildCommand": "cd frontend && npm ci && npm run build"
}
```

### Option 3: Install everything in installCommand only

```json
{
  "installCommand": "npm install && cd Backend && npm install && cd ../frontend && npm install",
  "buildCommand": "cd frontend && npm run build"
}
```

The current fix (Option 3) should work! 🚀
