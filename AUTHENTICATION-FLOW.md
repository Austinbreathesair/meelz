# Authentication Flow

This document explains how authentication and routing work in the Meelz app.

## Public Routes (No Authentication Required)

### 1. **Landing Page** (`/landing`)
- **Entry point** for all unauthenticated users
- Displays marketing content and feature highlights
- Has "Sign In" and "Get Started" buttons
- **Protected from authenticated users**: If a user is already signed in and tries to visit `/landing`, they are automatically redirected to `/pantry`

### 2. **Sign In Page** (`/signin`)
- Authentication page with:
  - Sign in with email/password
  - Sign up with email/password
  - Google OAuth login
- **Protected from authenticated users**: If a user is already signed in and tries to visit `/signin`, they are automatically redirected to `/pantry`

### 3. **Share Page** (`/share/[slug]`)
- **Publicly accessible** to everyone (authenticated or not)
- Allows users to view shared recipes via a unique link
- Does NOT require authentication
- Anyone with the link can view the shared recipe

## Protected Routes (Authentication Required)

All routes under `(authed)` require authentication:
- `/pantry` - Manage pantry items
- `/recipes` - Browse and search recipes
- `/shopping` - Generate shopping lists
- `/dashboard` - View spending analytics

### How Protection Works:
The `(authed)/layout.tsx` file checks authentication status:
- If user is **not authenticated** → Redirects to `/signin`
- If user **is authenticated** → Shows the page content
- While checking → Shows a loading spinner

## Root Page (`/`)

The root route (`/`) acts as a smart router:
- **Unauthenticated users** → Redirected to `/landing`
- **Authenticated users** → Redirected to `/pantry`

This ensures users always land in the right place based on their auth status.

## Flow Diagrams

### First-time Visitor:
```
Visit meelz.com (/)
  ↓
Check authentication
  ↓
Not authenticated
  ↓
Redirect to /landing
  ↓
Click "Get Started" or "Sign In"
  ↓
Go to /signin
  ↓
Sign in/Sign up
  ↓
Redirect to /pantry
```

### Returning Authenticated User:
```
Visit meelz.com (/)
  ↓
Check authentication
  ↓
Already authenticated
  ↓
Redirect to /pantry
```

### User Trying to Access Protected Page Without Auth:
```
Visit /pantry directly
  ↓
(authed) layout checks auth
  ↓
Not authenticated
  ↓
Redirect to /signin
  ↓
Sign in
  ↓
Return to /pantry
```

## Summary

✅ **Landing page** is the first thing visitors see  
✅ **All protected pages** require authentication  
✅ **Authenticated users** cannot see landing/signin pages  
✅ **Shared recipes** remain publicly accessible  
✅ **Smooth redirects** ensure users always land in the right place

