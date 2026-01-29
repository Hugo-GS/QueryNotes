# Deployment Guide

This guide covers security considerations and best practices when deploying QueryNotes.

## Security Considerations

QueryNotes is designed to be embedded in other websites (like portfolios) to document APIs. Since the application makes HTTP requests and renders content, there are security headers you should configure on your hosting platform.

### Recommended HTTP Headers

Configure these headers on your hosting platform (Netlify, Vercel, Cloudflare Pages, etc.):

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none';
```

#### Header Explanations

| Header | Purpose |
|--------|---------|
| `X-Frame-Options` | Prevents clickjacking by controlling who can embed your site in an iframe |
| `X-Content-Type-Options` | Prevents MIME type sniffing attacks |
| `Referrer-Policy` | Controls how much referrer information is sent with requests |
| `Content-Security-Policy` | Restricts what resources can be loaded and executed |

### If You Want to Allow Embedding

If you're embedding QueryNotes in another site (like your portfolio), modify the headers:

```
X-Frame-Options: ALLOW-FROM https://your-portfolio.com
Content-Security-Policy: ...; frame-ancestors 'self' https://your-portfolio.com;
```

> **Note:** `X-Frame-Options: ALLOW-FROM` is deprecated in some browsers. Use `frame-ancestors` in CSP as the primary control.

---

## Platform-Specific Configuration

### Netlify

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none';"
```

#### Restricting Embedding to Specific Domains (Netlify Edge Function)

For more control over who can embed your deployment, you can use a Netlify Edge Function:

1. Create `netlify/edge-functions/domain-guard.ts`:

```typescript
import type { Context } from "@netlify/edge-functions";

const ALLOWED_ORIGINS = [
  "https://your-portfolio.com",
  "https://www.your-portfolio.com",
];

export default async (request: Request, context: Context) => {
  const response = await context.next();
  const referer = request.headers.get("referer");
  const origin = request.headers.get("origin");

  const requestOrigin = origin || (referer ? new URL(referer).origin : null);

  // Allow direct access (no referer/origin)
  if (!requestOrigin) {
    return response;
  }

  // Check if origin is allowed
  const isAllowed = ALLOWED_ORIGINS.some(
    (allowed) => requestOrigin === allowed || requestOrigin.endsWith(allowed.replace("https://", "."))
  );

  if (!isAllowed) {
    return new Response("Forbidden: Origin not allowed", { status: 403 });
  }

  return response;
};
```

2. Reference it in `netlify.toml`:

```toml
[[edge_functions]]
  function = "domain-guard"
  path = "/*"
```

---

### Vercel

Create a `vercel.json` file in your project root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none';"
        }
      ]
    }
  ]
}
```

---

### Cloudflare Pages

Use a `_headers` file in your `public/` or output directory:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none';
```

---

## Deployment Strategy Recommendation

Since QueryNotes is meant to be customized for individual deployments, we recommend:

1. **Fork this repository** for your personal deployment
2. **Add your platform-specific config** (`netlify.toml`, `vercel.json`, etc.) to your fork
3. **Keep your fork synced** with upstream for updates

This way:
- The main repository stays clean and platform-agnostic
- Your deployment configuration remains private
- You can pull updates without conflicts

### Alternative: Branch-Based Deployment

If you prefer not to fork:

1. Keep `main` branch clean (synced with upstream)
2. Create a `deploy` branch with your platform config
3. Deploy from the `deploy` branch
4. Merge `main` into `deploy` when you want updates

---

## Environment Variables

QueryNotes does not require any environment variables for basic functionality.
