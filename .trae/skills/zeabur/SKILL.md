---
name: "zeabur"
description: "Guidance for deploying applications on Zeabur. Invoke when configuring builds, environment variables, domains, networking, or troubleshooting Zeabur deployments."
---

# Zeabur Deployment Guide

Zeabur is a platform for one-click deployments. This skill encapsulates best practices for deploying Node.js (Next.js/Express) applications on Zeabur.

## Next.js Deployment (Frontend)

For Next.js applications, use **Standalone Mode** for best compatibility.

### 1. Configuration (`next.config.ts`)
Avoid `output: 'export'` if using dynamic routes. Use `standalone` instead.

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // Do NOT set distDir to 'dist', let it use default '.next'
  images: {
    unoptimized: true,
  },
};
```

### 2. Environment Variables
- **NEXT_PUBLIC_API_URL**: Must point to the **public** backend URL (e.g., `https://your-backend.zeabur.app/api`).
- **Important**: After adding variables, you MUST **Redeploy** the service.

## Node.js/Express Deployment (Backend)

### 1. Build Command
Zeabur automatically detects `package.json`. Ensure you have:
- `build`: "tsc" (or your build script)
- `start`: "node dist/server.js" (command to run production server)

### 2. Environment Variables
- Configure database URLs and secrets in the **Variables** tab.
- Do NOT commit `.env` files.

## Networking & Domains

### Public Access
- **Frontend**: Needs a public domain (e.g., `peasy-frontend.zeabur.app`) to be accessible by users.
- **Backend**: Needs a public domain (e.g., `peasy-backend.zeabur.app`) so the Frontend (running in user's browser) can call the API.

### Internal Networking
- Services within the same project can communicate via private DNS (e.g., `backend.zeabur.internal`), but this is **ONLY** for server-to-server communication (e.g., SSR fetching data).
- **Client-side fetch** (running in browser) **MUST** use the Public URL.

## Troubleshooting

- **Configuration Error / Failed to fetch**: Usually means Frontend is trying to connect to `localhost` or an unreachable URL. Check `NEXT_PUBLIC_API_URL`.
- **Build Failed**: Check logs. For Next.js, ensure `output` is correct and no ESLint errors block the build (or set `eslint.ignoreDuringBuilds: true`).
