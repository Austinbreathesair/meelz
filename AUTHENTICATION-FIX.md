# Authentication Redirect Fix

## What Was Fixed

The issue where users were redirected to the landing page instead of the pantry after signing in has been resolved.

## Changes Made

### 1. Created OAuth Callback Route
**File:** `app/auth/callback/route.ts`

This route handles the OAuth callback from Google (and email confirmations) and properly exchanges the code for a session, then redirects to `/pantry`.

```typescript
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createServerSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/pantry', requestUrl.origin));
}
```

### 2. Updated Root Page to Check Auth
**File:** `app/page.tsx`

Now checks if the user is authenticated before deciding where to redirect:
- **Authenticated users** → `/pantry`
- **Not authenticated** → `/landing`

### 3. Updated OAuth Redirect URLs
**File:** `app/(public)/signin/page.tsx`

Changed all redirect URLs to point to `/auth/callback`:
- Google OAuth: `redirectTo: ${siteUrl}/auth/callback`
- Email sign-up: `emailRedirectTo: ${siteUrl}/auth/callback`

## Update Required in Google Console

You need to update your Google OAuth settings with the new callback URL:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/auth/callback
   https://your-production-domain.com/auth/callback
   ```
5. Keep the Supabase callback URL as well:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
6. Click **Save**

## How Authentication Works Now

### Email/Password Sign In:
1. User enters credentials on `/signin`
2. App signs in with Supabase
3. Creates/updates profile
4. **Redirects directly to `/pantry`** ✅

### Email/Password Sign Up:
1. User enters email and password on `/signin` (Sign Up tab)
2. App creates account in Supabase
3. Creates profile
4. If email confirmation is disabled:
   - **Redirects directly to `/pantry`** ✅
5. If email confirmation is enabled:
   - Shows "Check your email" message
   - User clicks link in email
   - Link goes to `/auth/callback`
   - Callback route exchanges code for session
   - **Redirects to `/pantry`** ✅

### Google OAuth:
1. User clicks Google button
2. Redirects to Google sign-in
3. User authorizes
4. Google redirects to `/auth/callback` with code
5. Callback route exchanges code for session
6. Creates/updates profile (handled by Supabase)
7. **Redirects to `/pantry`** ✅

### Visiting Root URL:
1. User visits `/`
2. App checks authentication
3. If authenticated → `/pantry` ✅
4. If not authenticated → `/landing` ✅

## Testing

### Test Email Sign In:
```bash
1. Go to /signin
2. Enter existing email/password
3. Click "LOGIN"
4. Should redirect to /pantry immediately ✅
```

### Test Email Sign Up:
```bash
1. Go to /signin
2. Click "Sign Up" tab
3. Enter new email/password
4. Confirm password
5. Click "SIGN UP"
6. Should redirect to /pantry immediately (if email confirmation off) ✅
7. OR show "Check your email" message (if confirmation on)
8. Click email link → should redirect to /pantry ✅
```

### Test Google OAuth:
```bash
1. Go to /signin
2. Click "Google" button
3. Complete Google authorization
4. Should redirect to /pantry ✅
```

### Test Root URL:
```bash
# When signed out:
1. Visit /
2. Should show landing page ✅

# When signed in:
1. Visit /
2. Should go directly to /pantry ✅
```

## Troubleshooting

### Still redirecting to landing page after Google sign-in?
- Clear browser cookies and try again
- Check browser console for errors
- Verify `/auth/callback` URL is added to Google Console
- Wait a few minutes for Google to update (caching)

### "Invalid redirect_uri" error?
- Make sure you added `/auth/callback` to Google Console
- Check for typos in the URL
- Verify the protocol (http vs https)

### Email sign-in works but Google doesn't?
- This is likely a Google Console configuration issue
- Double-check the authorized redirect URIs
- Try in incognito mode

### Getting redirected back to sign-in page?
- Check that the authentication session is being set
- Open DevTools → Application → Cookies
- Look for `sb-*` cookies from Supabase
- If missing, there may be a session storage issue

## Environment Variables

Make sure you have these set:

**.env.local:**
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
```

## Summary

✅ Email sign-in redirects to `/pantry`
✅ Email sign-up redirects to `/pantry`
✅ Google OAuth redirects to `/pantry`
✅ Root URL redirects authenticated users to `/pantry`
✅ Root URL shows landing page for guests
✅ OAuth callback route properly handles code exchange

**Everything should now work as expected!** 🎉


