# Deployment Guide

## Local Development

### Start Backend
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## Production Deployment

### 1. Deploy Backend to Render

1. Create a new Web Service on [render.com](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python -m app.seed`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-app.vercel.app` (replace with your actual Vercel URL)
5. Deploy

Note the Render URL (e.g., `https://zoom-clone-api.onrender.com`)

### 2. Deploy Frontend to Vercel

1. Create a new project on [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `frontend`
4. Add Environment Variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://zoom-clone-api.onrender.com` (replace with your Render URL)
5. Deploy

---

## Important: Environment Variables

### Backend (Render)
- `FRONTEND_URL`: Must be set to your Vercel frontend URL to enable CORS and correct invite links

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: Must be set to your Render backend URL to avoid localhost in production

**Without these, the app will fail with CORS errors or point to localhost.**

---

## Post-Deployment Verification

1. Open your Vercel URL in a browser
2. Verify dashboard loads with real data
3. Create a new meeting
4. Copy the invite link
5. Open the link in an incognito window
6. Join with a display name
7. Verify participant appears
8. Leave the meeting
9. Verify it appears in Recent

---

## Database

SQLite database (`zoom_clone.db`) is created automatically on first run.

To reset the database:
1. Delete `backend/zoom_clone.db`
2. Restart the backend (it will recreate and seed automatically)

---

## Troubleshooting

### Frontend shows "Could not reach the server"
- Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify the backend is running and accessible
- Check CORS settings in `backend/app/main.py`

### Meeting IDs don't work
- Ensure the backend database is seeded
- Check that the meeting code is exactly 11 digits

### Invite links don't work
- Verify `FRONTEND_URL` is set correctly on the backend
- Check that the frontend URL matches exactly (including protocol)
