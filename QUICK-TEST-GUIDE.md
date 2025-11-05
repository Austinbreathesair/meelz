# Quick Test Guide

## Testing the Landing Page

The root URL (`/`) redirects to `/landing` automatically.

**If you're not seeing the landing page:**

1. **Sign out** of the app (click Sign out button)
2. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Select "Cached images and files"
   - Click "Clear data"
3. **Close and reopen** your browser
4. **Visit the root URL** `http://localhost:3000/` or your deployed URL
5. You should now see the new professional landing page!

**Why this happens:**
- If you're logged in, the browser may remember your last route
- The manifest.json sets `start_url` to `/pantry` for installed PWA users
- But the website root URL always redirects to `/landing` for new visitors

## Testing PWA Installation

### Quick Test (Development Mode)

After my recent update, the service worker now registers in development mode too.

**Steps:**
1. Make sure your dev server is running: `npm run dev`
2. Open DevTools (F12)
3. Go to **Application** tab → **Service Workers**
4. You should see the service worker registered
5. Go to **Application** tab → **Manifest**
6. You should see all manifest details

### On Android Mobile

**Requirements:**
- Must be on HTTPS (production deployment)
- Or use `localhost` (works without HTTPS)

**To install:**
1. Open the app in Chrome
2. You should see an install banner at the bottom, OR
3. Tap the **⋮** menu → **"Add to Home screen"**
4. Tap **"Add"** or **"Install"**
5. The app icon appears on your home screen

### On iOS Mobile

**Requirements:**
- Must use **Safari** (not Chrome)
- Must be on HTTPS or localhost

**To install:**
1. Open the app in **Safari**
2. Tap the **Share button** (⎙) at the bottom
3. Scroll and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon appears on your home screen

### Desktop (Chrome/Edge)

1. Look for the **install icon** (⊕) in the address bar
2. Click it and confirm **"Install"**
3. App opens in its own window

## Troubleshooting

### "Still seeing the old page"
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Try incognito/private mode
- Check you're visiting the root URL `/` not `/pantry`

### "No install prompt on mobile"
- Make sure you're on HTTPS (production) or localhost
- On iOS, MUST use Safari
- Try refreshing the page
- Check DevTools → Application → Service Workers (should be "Activated")

### "Service worker not registering"
- Check DevTools Console for errors
- Make sure `/service-worker.js` file exists in your `public` folder
- Try unregistering old service workers:
  - DevTools → Application → Service Workers → Unregister
  - Then refresh the page

## Verification Checklist

✅ Root URL `/` shows landing page (when signed out)
✅ Service worker registered (check DevTools)
✅ Manifest.json accessible at `/manifest.json`
✅ Icons exist at `/icons/icon-192.png` and `/icons/icon-512.png`
✅ HTTPS enabled (for production)
✅ Install prompt appears (on mobile)
✅ App works offline (after first visit)

## Production Deployment

For PWA to work properly in production:

```bash
# Build the app
npm run build

# Start production server
npm start
```

Then deploy to a service that supports HTTPS:
- Vercel (automatic HTTPS)
- Netlify (automatic HTTPS)
- Your own server with SSL certificate

**Note:** Service workers and PWA installation only work reliably on HTTPS or localhost.


