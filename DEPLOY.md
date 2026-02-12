# Deployment Guide (Zeabur)

This project consists of a **Frontend (Next.js)** and a **Backend (Node.js/Express)**. Follow these steps to deploy them to Zeabur.

## 1. Prerequisites
- A Zeabur account.
- A GitHub account connected to Zeabur.
- **InsForge Credentials** (from your backend `.env` or InsForge dashboard).

## 2. Backend Deployment (Deploy First)

1. **Create Service**: In Zeabur, create a new Service -> **Git**.
2. **Select Repo**: Select this repository.
3. **Settings**:
   - **Root Directory**: `backend`
   - **Watch Paths**: `backend/**` (optional)
4. **Environment Variables**:
   Add the following variables in the **Variables** tab:
   
   | Variable | Value | Description |
   |----------|-------|-------------|
   | `DATABASE_URL` | `postgresql://...` | Your InsForge/Postgres connection string |
   | `INSFORGE_API_URL` | `https://7jy9rxai.us-east.insforge.app` | InsForge API URL |
   | `INSFORGE_ANON_KEY` | `ik_79a7478f43b81c046050de130453fa02` | InsForge Anon Key |
   | `JWT_SECRET` | (Generate a random string) | For secure fallback decoding |
   | `PORT` | `3001` | Optional (Zeabur usually sets PORT) |

5. **Deploy**: Click Deploy. Zeabur will install dependencies and start the server.
6. **Domain**:
   - Go to **Networking** or **Domains**.
   - Create a public domain (e.g., `peasy-backend.zeabur.app`).
   - **COPY THIS URL**. You need it for the frontend.

## 3. Frontend Deployment

1. **Create Service**: In Zeabur, create a new Service -> **Git**.
2. **Select Repo**: Select this repository (again).
3. **Settings**:
   - **Root Directory**: `frontend`
4. **Environment Variables**:
   
   | Variable | Value | Description |
   |----------|-------|-------------|
   | `NEXT_PUBLIC_API_URL` | `https://peasy-backend.zeabur.app/api` | **Must include `/api` suffix**. Replace with YOUR backend domain. |

5. **Deploy**: Click Deploy.
6. **Domain**:
   - Create a public domain (e.g., `peasy-frontend.zeabur.app`).
   - Visit this URL to use your app!

## Troubleshooting

- **"Session expired" or Login Loop**:
  - Ensure `NEXT_PUBLIC_API_URL` is correct and publicly accessible.
  - Check that Backend has `INSFORGE_API_URL` and keys set correctly.
- **Build Failed**:
  - Check logs in Zeabur.
  - Ensure `output: 'standalone'` is set in `next.config.ts` (it is configured by default now).
- **CORS Errors**:
  - The backend is configured to allow all origins (`cors()`), so this shouldn't be an issue. If strict CORS is needed later, update `backend/src/server.ts`.
