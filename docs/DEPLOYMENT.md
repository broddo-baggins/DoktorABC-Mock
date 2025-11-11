# Deployment Guide

This project is deployed on two platforms for redundancy and performance.

## Live Deployments

**GitHub Pages (Primary - Portfolio):** https://broddo-baggins.github.io/DoktorABC-Mock/  
**Vercel (Alternative):** https://doktorabc-mock.vercel.app

Both deployments automatically update on every push to the `master` branch.

---

## GitHub Pages Deployment

### Initial Setup

1. Go to your GitHub repository settings
2. Navigate to **Pages** (under "Code and automation")
3. Under **Source**, select **GitHub Actions**
4. Push to `master` branch to trigger deployment

### How It Works

- Uses GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Builds the project with Vite
- Deploys to GitHub Pages automatically
- Handles client-side routing with custom 404 redirect
- Deployment time: ~5 minutes

### Manual Trigger

You can manually trigger deployment:

1. Go to **Actions** tab in repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

---

## Vercel Deployment

### Initial Setup

1. Sign in to [vercel.com](https://vercel.com) with GitHub
2. Click **Add New Project**
3. Import `broddo-baggins/DoktorABC-Mock` repository
4. Click **Deploy** (settings auto-detected from `vercel.json`)

### How It Works

- Automatically detects Vite configuration
- Uses `vercel.json` for build settings
- Supports SPA routing via rewrites
- Deployment time: ~2 minutes
- Preview deployments for every PR/commit

### Benefits

- Faster deployments
- Global CDN
- Preview URLs for PRs
- Better performance

---

## Configuration Files

### `vite.config.js`
- Conditionally sets base path based on deployment platform
- Uses `process.env.VERCEL` for Vercel builds
- Uses `/DoktorABC-Mock/` for GitHub Pages builds
- Implements code splitting for optimized bundle sizes

### `vercel.json`
- Defines build command and output directory
- Configures SPA routing with rewrites
- Sets framework to Vite

### `.github/workflows/deploy.yml`
- Automates GitHub Pages deployment
- Runs on push to `master` branch
- Builds and uploads artifacts

### `index.html` & `public/404.html`
- GitHub Pages SPA redirect handler
- Prevents 404 errors on direct route access

---

## Troubleshooting

### GitHub Pages shows 404
- Verify GitHub Pages is enabled with "GitHub Actions" source
- Check workflow completed successfully in Actions tab
- Wait 5-10 minutes for first deployment

### Vercel assets not loading
- Check that `VERCEL` environment variable is set during build
- Verify `vercel.json` buildCommand includes `VERCEL=1`
- Inspect browser console for errors

### Workflow fails
- Check Actions tab for error details
- Ensure `package.json` and `package-lock.json` are committed
- Verify `node_modules` is in `.gitignore`

---

## Notes

- Both platforms support automatic HTTPS
- No server-side code or environment variables required
- All data is mock/frontend-only (LocalStorage)
- Changes appear within minutes after successful build

---

**For demo credentials and testing, see:** [`DEMO_CREDENTIALS.md`](./DEMO_CREDENTIALS.md)
