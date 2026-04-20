---
name: auth-and-roles
description: Authentication flow, role-based access control, and session management patterns
---

# Authentication & Role Management

## Auth Architecture

- **Provider**: next-auth v4 with Credentials provider (JWT strategy)
- **Login methods**: Email/password, OTP (SMS), Firebase social login (Google, Apple)
- **Token management**: Access token + Refresh token with automatic refresh in JWT callback

## Session Data

```tsx
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();

// Available properties:
session.user         // { name, surname, email }
session.accessToken  // { token, expiration }
session.refreshToken // { userId, token, expiration }
session.userType     // 1=Individual, 2=Corporate
session.isSeller     // boolean
session.sellerCode   // string
session.sellerName   // string
session.userCode     // string
session.companyId    // string
session.companyCode  // string
session.roles        // string[]
session.isPlatformUser // boolean
session.profilePhoto // string
session.error        // "RefreshTokenExpired" | "RefreshTokenError" | undefined
```

## Role-based Access Control

This project uses `useRole` hook (not permission codes like the admin panel):

```tsx
import { useRole } from "@/util/useRole";

const { hasRole, hasAnyRole } = useRole();

// Check corporate admin role
if (hasRole("corporateAdmin")) {
  // Show admin-only features
}

// Check any of multiple roles
if (hasAnyRole(["corporateAdmin", "corporateUser"])) {
  // Show feature for any role
}
```

### Role Logic
1. First check: `isSeller === true` AND `userType === 2` (Corporate)
2. If yes → check `session.roles` array for the specified role
3. If no (individual user or not seller) → returns `true` (full access)

## Route Protection

### Middleware-level (proxy.ts)
- `protectedRoutes` → requires authentication (redirects to login)
- `authRoutes` → redirects to home if already logged in
- Product creation routes → requires `isSeller` flag
- Seller routes → redirects non-sellers to become-seller page

### Client-level
```tsx
const { data: session, status } = useSession();

if (status === "loading") return <LoadingPage />;
if (status === "unauthenticated") {
  // redirect or show login popup
}
```

## Session Update

```tsx
import { useSession } from "next-auth/react";

const { update } = useSession();

// After user updates their profile
await update({
  isSeller: true,
  sellerCode: "newCode",
});
```

## Error Handling for Auth

The `nextApiClient` interceptor automatically handles `SessionTerminated` responses from backend:
- Dispatches `AUTH_ERROR_EVENT`
- `SessionProvider` listens and triggers `signOut()`

```tsx
// Check for expired tokens
if (session?.error === "RefreshTokenExpired") {
  // Session is invalid, user needs to re-login
}
```
