# 🚀 GitHub Pages Deployment Guide

This guide will help you deploy your DoktorABC Mock project to GitHub Pages for free hosting.

## Prerequisites

- Your code is already on GitHub in a repository
- You have push access to the repository

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/DoktorABC-Mock`
2. Click on **Settings** (top right)
3. In the left sidebar, click **Pages** (under "Code and automation")
4. Under **Source**, select **GitHub Actions**

That's it for the GitHub setup!

### 2. Push Your Changes

The deployment workflow is already configured. Just push your code:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin master
```

### 3. Wait for Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually takes 1-3 minutes)
4. Once complete, your site will be live!

## 🌐 Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/DoktorABC-Mock/
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 🔄 Automatic Deployments

Every time you push to the `master` branch, your site will automatically rebuild and redeploy. No manual steps needed!

## 🛠️ Manual Deployment

You can also trigger a deployment manually:

1. Go to the **Actions** tab
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select the branch and click **Run workflow**

## 📝 Notes

- The first deployment might take a bit longer
- Changes appear within a few minutes after the workflow completes
- If you change your repository name, update the `base` in `vite.config.js`

## 🐛 Troubleshooting

### Site shows 404
- Make sure GitHub Pages is enabled with "GitHub Actions" as the source
- Check that the workflow completed successfully
- Wait 5-10 minutes after first deployment

### Assets not loading (blank page)
- Verify the `base` path in `vite.config.js` matches your repo name
- Check browser console for 404 errors

### Workflow fails
- Check the Actions tab for error messages
- Ensure `package.json` and `package-lock.json` are committed
- Verify node_modules is in `.gitignore`

## 🎉 You're Done!

Your app is now live on the internet and will auto-update whenever you push changes!

