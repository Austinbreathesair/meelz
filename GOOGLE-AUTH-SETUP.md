# Google OAuth Setup Guide

Your app now has full sign-up and Google sign-in functionality! However, you need to configure Google OAuth in Supabase for it to work.

## What's Already Implemented

✅ Sign up with email/password
✅ Sign in with email/password  
✅ Toggle between sign-in and sign-up modes
✅ Password validation (min 6 characters)
✅ Password confirmation matching
✅ Google OAuth button (needs Supabase configuration)
✅ Error and success messages
✅ Auto profile creation

## Setting Up Google OAuth in Supabase

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in app name: **Meelz**
   - Add your email as developer contact
   - Save and continue through the rest

6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: **Meelz Web App**
   - **Authorized JavaScript origins:**
     ```
     https://your-project-ref.supabase.co
     http://localhost:3000
     ```
   - **Authorized redirect URIs:**
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     http://localhost:3000/auth/v1/callback
     ```
   
7. Click **Create**
8. Copy your **Client ID** and **Client Secret**

### Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list
5. Toggle **Enable Sign in with Google** to ON
6. Paste your **Client ID** and **Client Secret** from Google
7. Click **Save**

### Step 3: Get Your Supabase Redirect URL

Supabase provides a redirect URL for you. Find it in the Google provider settings:
```
https://your-project-ref.supabase.co/auth/v1/callback
```

Make sure this EXACT URL is added to Google Console's Authorized redirect URIs.

### Step 4: Update Environment Variables (Optional)

If you want to set the site URL explicitly, add to your `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
# or for local development:
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 5: Test It!

1. **Sign Up Test:**
   - Go to `/signin`
   - Click "Sign Up" tab
   - Enter email and password (min 6 chars)
   - Confirm password
   - Click "SIGN UP"
   - Check for success message or auto sign-in

2. **Sign In Test:**
   - Go to `/signin`
   - Click "Sign In" tab
   - Enter email and password
   - Click "LOGIN"
   - Should redirect to `/pantry`

3. **Google OAuth Test:**
   - Click "Google" button on either tab
   - Should redirect to Google sign-in
   - After authorization, should redirect back to `/pantry`

## Troubleshooting

### "Invalid redirect URI"
- Make sure the Supabase callback URL is added to Google Console
- Check for typos or missing slashes
- Wait a few minutes after adding URIs (Google caching)

### "Email confirmation required"
If you get "Check your email for confirmation link":
- Go to Supabase Dashboard → **Authentication** → **Settings**
- Look for **Email Auth**
- Toggle **Enable email confirmations** OFF for development
- Click **Save**

### Google button does nothing
- Check browser console for errors
- Verify Google provider is enabled in Supabase
- Check that Client ID and Secret are correct
- Try in incognito mode (clear cookies)

### "User already registered"
- This is expected if you sign up with the same email twice
- Use the sign-in tab instead
- Or use a different email

### Google OAuth works locally but not in production
- Update Authorized JavaScript origins with production URL
- Update Authorized redirect URIs with production Supabase URL
- Update NEXT_PUBLIC_SITE_URL environment variable

## Email Configuration (Optional)

By default, Supabase sends confirmation emails. To customize:

1. Go to **Authentication** → **Email Templates**
2. Customize the templates:
   - Confirm signup
   - Magic link
   - Password reset

## Features Included

### Sign Up:
- ✅ Email validation
- ✅ Password strength requirement (min 6 chars)
- ✅ Password confirmation matching
- ✅ Automatic profile creation
- ✅ Success message or auto sign-in
- ✅ Error handling

### Sign In:
- ✅ Email/password authentication
- ✅ Remember me checkbox
- ✅ Error messages
- ✅ Auto redirect to pantry

### Google OAuth:
- ✅ One-click sign-in/sign-up
- ✅ Automatic profile creation
- ✅ Offline access tokens
- ✅ Auto redirect to pantry

## Testing Checklist

- [ ] Create new account with email/password
- [ ] Sign in with existing account
- [ ] Try signing up with same email (should error)
- [ ] Test password too short (should error)
- [ ] Test passwords don't match (should error)
- [ ] Click Google button
- [ ] Complete Google OAuth flow
- [ ] Sign in again with Google
- [ ] Check profile is created in database
- [ ] Toggle between sign-in/sign-up tabs

## Database Schema

The app automatically creates profiles in the `profile` table:

```sql
-- Profile is auto-created on sign-up with:
{
  id: user.id,
  display_name: email.split('@')[0]
}
```

## Security Notes

- Passwords must be at least 6 characters
- Supabase handles password hashing
- OAuth tokens are managed by Supabase
- Session management is automatic
- RLS policies protect user data

## Next Steps

After setup:
1. Test both sign-up and sign-in flows
2. Try Google OAuth
3. Customize email templates (optional)
4. Add password reset flow (optional)
5. Deploy to production and update OAuth settings

---

**Need help?** Check the [Supabase Auth docs](https://supabase.com/docs/guides/auth) or [Google OAuth docs](https://developers.google.com/identity/protocols/oauth2).


