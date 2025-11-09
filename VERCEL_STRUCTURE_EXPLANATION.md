# Why API Folder is at Root - Explanation & Alternatives

## Current Structure (Vercel Convention)

```
Sky_Assist/
├── api/              ← Serverless function (Vercel convention)
│   └── index.js
├── Backend/          ← Your Express app
│   └── server.js
└── frontend/         ← React app
```

## Why API Folder is at Root?

**Vercel's Convention**: Vercel automatically detects serverless functions in an `api/` folder at the **root level** of your project. This is Vercel's standard convention.

### Benefits of Current Structure:

- ✅ Follows Vercel's standard convention
- ✅ Automatic serverless function detection
- ✅ Simple configuration
- ✅ Clear separation: API handler vs. Backend code

### How It Works:

1. `api/index.js` is a thin wrapper that loads your Express app
2. It requires `../Backend/server.js` to get your actual backend code
3. Vercel routes all `/api/*` requests to `api/index.js`
4. Your Express app handles the requests

## Alternative Approaches

### Option 1: Move API Inside Backend (Recommended if you prefer)

You can move the `api` folder inside `Backend/` and update `vercel.json`:

```
Sky_Assist/
├── Backend/
│   ├── api/          ← Move here
│   │   └── index.js
│   └── server.js
└── frontend/
```

**Pros**: Keeps API handler with backend code
**Cons**: Requires custom Vercel configuration

### Option 2: Use Backend Directory Directly

Configure Vercel to use `Backend/server.js` directly without an `api` folder.

**Pros**: No extra wrapper file
**Cons**: Less flexible, harder to configure

### Option 3: Keep Current Structure (Recommended)

Keep `api/` at root as it follows Vercel's convention.

**Pros**:

- Standard Vercel structure
- Easy to understand
- Better separation of concerns
- The `api/index.js` is just a thin adapter layer

## Recommendation

**Keep the current structure** because:

1. It follows Vercel's standard convention
2. It's cleaner - `api/index.js` is just an adapter, your actual backend code stays in `Backend/`
3. It's easier for Vercel to auto-detect and configure
4. Better separation: deployment adapter (`api/`) vs. application code (`Backend/`)

## What Would You Prefer?

I can reorganize it to any of these structures if you prefer. Just let me know!
