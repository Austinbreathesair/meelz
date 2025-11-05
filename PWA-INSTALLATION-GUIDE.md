# PWA Installation Guide - Meelz

## How to Install Meelz as a PWA

### For Android (Chrome/Edge)

1. Open the app in Chrome or Edge browser
2. Look for the **install banner** at the bottom of the screen, OR
3. Tap the **three-dot menu** (⋮) in the top right
4. Select **"Add to Home screen"** or **"Install app"**
5. Confirm by tapping **"Add"** or **"Install"**
6. The app icon will appear on your home screen

**Alternative method:**
- Some browsers show an install icon in the address bar (⬇ or ⊕)

### For iOS (Safari)

1. Open the app in **Safari** (must be Safari, not Chrome)
2. Tap the **Share button** (⎙) at the bottom of the screen
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired (default: "Meelz")
5. Tap **"Add"** in the top right
6. The app icon will appear on your home screen

**Note:** iOS only supports PWA installation through Safari, not Chrome or other browsers.

### For Desktop (Chrome/Edge)

1. Open the app in Chrome or Edge
2. Look for the **install icon** (⊕) in the address bar
3. Click it and confirm **"Install"**
4. The app will open in its own window
5. Access it from your Start Menu/Dock/Applications

## Troubleshooting

### "I don't see the install option"

**Requirements for PWA installation:**
- ✅ Must be served over HTTPS (not http://)
- ✅ Must have a valid manifest.json
- ✅ Must have a service worker registered
- ✅ Must have icons (192x192 and 512x512)

**Check:**
1. Are you on the production/deployed site? (PWAs need HTTPS)
2. On iOS, are you using Safari? (Required for iOS)
3. Try force-refreshing the page (Ctrl+Shift+R or Cmd+Shift+R)
4. Check if service worker is registered:
   - Open DevTools (F12)
   - Go to Application tab
   - Check "Service Workers" section
   - Should see "Activated and running"

### "The install banner disappeared"

- The browser may hide it after being dismissed
- You can still install via the browser menu:
  - Chrome Android: Menu → "Add to Home screen"
  - Safari iOS: Share → "Add to Home Screen"
  - Chrome Desktop: Menu → "Install Meelz..."

### "I installed it but it opens in the browser"

- Make sure you're tapping the **app icon** on your home screen, not opening the browser
- The installed app should open in standalone mode (no browser UI)
- If it still shows browser UI, check manifest.json "display" is set to "standalone"

## Verifying PWA Installation

Once installed, the app should:
- ✅ Open in its own window (no browser address bar)
- ✅ Have its own icon on home screen/app drawer
- ✅ Work offline (service worker caches resources)
- ✅ Show splash screen on launch
- ✅ Appear in app switcher as separate app

## PWA Features

When installed as a PWA, Meelz provides:

- **Offline Access:** View pantry, recipes, and data without internet
- **Fast Loading:** Cached resources load instantly
- **Native Feel:** Looks and feels like a native app
- **Push Notifications:** (If enabled in future)
- **Background Sync:** Data syncs when connection restored

## Developer Testing

To test PWA features during development:

1. **Service Worker:**
   ```
   DevTools → Application → Service Workers
   ```

2. **Manifest:**
   ```
   DevTools → Application → Manifest
   ```

3. **Lighthouse PWA Audit:**
   ```
   DevTools → Lighthouse → Categories: Progressive Web App
   ```

4. **Simulate offline:**
   ```
   DevTools → Network → Throttling → Offline
   ```

## Additional Notes

- **iOS limitations:** Some PWA features limited on iOS (e.g., no push notifications)
- **Updates:** PWA updates automatically when new version deployed
- **Uninstall:** Long-press app icon → Remove/Uninstall
- **Storage:** PWA data stored in browser storage (IndexedDB, localStorage)

## Support

If you continue having issues:
1. Check browser console for errors (F12)
2. Verify manifest.json is accessible at /manifest.json
3. Ensure service worker is registered (check DevTools → Application)
4. Try a hard refresh and wait 30 seconds
5. Clear browser cache and try again


