# Vercel Deployment Guide

This guide will help you deploy your DoktorABC Mock project to Vercel for fast, global hosting.

## Prerequisites

- Your code is on GitHub (already done)
- A Vercel account (free tier available)
- 5 minutes

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository**: `broddo-baggins/DoktorABC-Mock`
5. **Configure Project**:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
6. **Click "Deploy"**

That's it! Your site will be live in ~2 minutes.

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow the prompts:
# - Link to existing project? No (first time)
# - Project name? doktorabc-mock (or your choice)
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

## Your Live Site

After deployment, Vercel will provide you with:
- **Production URL**: `https://doktorabc-mock.vercel.app` (or custom domain)
- **Preview URLs**: For every commit/PR

## Automatic Deployments

Vercel automatically deploys:
- Every push to `master` branch → Production
- Every PR → Preview deployment
- Every commit → Preview deployment

## Configuration

The project includes `vercel.json` with:
- SPA routing (all routes redirect to `index.html`)
- Build settings (auto-detected from Vite)
- Framework detection

## Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## Vercel vs GitHub Pages

| Feature | Vercel | GitHub Pages |
|---------|--------|--------------|
| **Speed** | Global CDN | Good |
| **Deploy Time** | ~2 min | ~3-5 min |
| **Preview Deployments** | Every commit/PR | Only main branch |
| **Custom Domain** | Free SSL | Free SSL |
| **Analytics** | Built-in | External |
| **Bandwidth** | Generous free tier | Unlimited |
| **HTTPS** | Auto | Auto |

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct build script
- Verify Node.js version (Vercel auto-detects)

### Routes Show 404
- Verify `vercel.json` exists with rewrites configuration
- Check that `index.html` is in `dist` folder after build

### Assets Not Loading
- Ensure `vite.config.js` base is set correctly (auto-handled for Vercel)
- Check browser console for errors

## You're Done!

Your app is now live on Vercel with:
- Lightning-fast global CDN
- Automatic deployments
- Built-in analytics
- Custom domain support

---

**Need Help?** Check Vercel docs: https://vercel.com/docs

