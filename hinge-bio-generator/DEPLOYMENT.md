# Free Deployment Guide - Free Forever Options

## ⚠️ Important Reality Check

**There is no truly "free forever" hosting for a Node.js backend that needs to run 24/7.** However, these options work great for personal projects:

---

## ✅ Best Option: Vercel + Railway (Free Tier)

**Frontend: Vercel (Free Forever)**

- Unlimited bandwidth
- Free SSL
- Automatic deployments from GitHub

**Backend: Railway ($5/month after trial) or Render (Free tier with sleep)**

Actually, let me give you a **truly free option**:

---

## ✅ Truly Free: GitHub Pages + OpenAI API Calls from Frontend

**Frontend: GitHub Pages (Completely Free Forever)**

- Unlimited bandwidth
- Free SSL
- Custom domain support

**Backend: OpenAI API called directly from frontend**

⚠️ **Warning**: This exposes your OpenAI API key to the public. Not recommended for production.

---

## ✅ Recommended: Vercel (Frontend) + Railway (Backend)

**Railway Free Tier**: 500 hours/month - enough for personal use!

- Service goes to sleep after 15 minutes of inactivity
- Wakes up when someone visits
- Perfect for personal projects

**Steps:**

### 1. Deploy Backend to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select this repo → Select `server` folder as root
5. In Variables, add: `OPENAI_API_KEY=your_key_here`
6. Copy your Railway URL (e.g., `https://your-app.railway.app`)

### 2. Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your repo
5. Set Root Directory to `client`
6. Add Environment Variable:
   - `REACT_APP_API_URL=https://your-railway-app.railway.app/api`
7. Deploy!

### 3. Update Vercel Rewrites

Edit `client/vercel.json` and replace `your-railway-app.up.railway.app` with your actual Railway URL.

---

## 📝 Summary

| Service    | Cost               | Link                | Notes                    |
| ---------- | ------------------ | ------------------- | ------------------------ |
| Vercel     | Free forever       | vercel.com          | Frontend hosting         |
| Railway    | 500 hrs/month free | railway.app         | Backend hosting          |
| OpenAI API | Pay per use        | platform.openai.com | Required for app to work |

**Total cost**: $0 (Railway free tier is enough for personal use)
