# Deployment Guide (Zeabur)

This project consists of a **Frontend (Next.js)** and a **Backend (Node.js/Express)**. Follow these steps to deploy them to Zeabur.

## 1. Database Setup (PostgreSQL)
Before deploying the application, you need a PostgreSQL database.
1. Create a PostgreSQL service in Zeabur (or use Supabase/Neon).
2. Get the connection string (e.g., `postgresql://user:password@host:port/dbname`).
3. You will need this for the **Backend** environment variables.

## 2. Backend Deployment
1. Create a new Service in Zeabur -> **Git**.
2. Select this repository.
3. **IMPORTANT**: Configure the service settings:
   - **Root Directory**: `backend` (This tells Zeabur to look in the backend folder).
   - **Watch Paths**: `backend/**` (Optional).
4. **Environment Variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: A long random string for security.
   - `PORT`: `3001` (Or let Zeabur assign one, usually `8080` or `3000`. Our code uses `process.env.PORT || 3001`, so it will adapt).
5. Deploy. Zeabur should detect it as a Node.js project and run `npm install && npm run build` and then start it.
6. **Get the Backend URL**:
   - Go to "Networking" or "Domains" in Zeabur for the backend service.
   - Create a domain (e.g., `peasy-backend.zeabur.app`).
   - **Copy this URL**. You need it for the frontend.

## 3. Frontend Deployment
1. Create a new Service in Zeabur -> **Git**.
2. Select this repository (again).
3. **IMPORTANT**: Configure the service settings:
   - **Root Directory**: `frontend`.
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.zeabur.app/api` (Replace with the URL from Step 2. **Must include `/api` at the end**).
5. Deploy. Zeabur should detect it as a Next.js project.
6. Visit your frontend domain.

## Troubleshooting
- **Connection Failed**: Check the "Debug Info" box on the Login page.
- **Database Error**: Check Backend logs in Zeabur. Ensure `DATABASE_URL` is correct.
- **CORS Error**: If you see CORS errors in the browser console, you may need to configure CORS in `backend/src/server.ts` to only allow your frontend domain. (Currently it allows all origins `*`, so it should work).
