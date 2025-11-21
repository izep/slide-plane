# Deployment Instructions for Slide Plane

## Repository Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in as `izep`
2. Click the "+" icon in the top right and select "New repository"
3. Repository name: `slide-plane`
4. Description: "A fast-paced side-scrolling airplane game built with Phaser 3, React, and TypeScript"
5. Set to **Public**
6. **Do NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 2. Push Code to GitHub

From your project directory (`C:\Code\izep\sidescroller`), run:

```powershell
git remote add origin https://github.com/izep/slide-plane.git
git branch -M main
git push -u origin main
```

## Running the Game Locally

### Development Mode

```powershell
npm run dev
```

The game will be available at `http://localhost:8080`

### Production Build

```powershell
npm run build
```

Built files will be in the `dist/` directory.

## Deploy to GitHub Pages (Optional)

### Method 1: Manual Deployment

1. Build the game:
   ```powershell
   npm run build
   ```

2. Install gh-pages package:
   ```powershell
   npm install -D gh-pages
   ```

3. Add to package.json scripts:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

4. Deploy:
   ```powershell
   npm run deploy
   ```

5. Enable GitHub Pages:
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

Game will be available at: `https://izep.github.io/slide-plane`

### Method 2: GitHub Actions (Automated)

The repository includes `.github/workflows/deploy.yml` that uses the official GitHub Pages deployment actions.

**Setup:**
1. Go to repository Settings → Pages
2. Source: Select "GitHub Actions"
3. Save

**Configuration:**
The workflow automatically:
- Builds the game on every push to `main`
- Uploads the build artifact
- Deploys to GitHub Pages

**Workflow overview:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - name: Setup Pages
      uses: actions/configure-pages@v5
    - name: Install dependencies
      run: npm ci
    - name: Build
      run: npm run build-nolog
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

Then push to GitHub, and it will automatically deploy on every push to main.

## Testing

### Local Testing

1. Start dev server: `npm run dev`
2. Test in multiple browsers:
   - Chrome
   - Firefox
   - Edge
   - Safari (if available)

3. Test mobile responsiveness:
   - Open browser DevTools (F12)
   - Click device toolbar (Ctrl+Shift+M)
   - Test various device sizes

### Mobile Device Testing

1. Find your local IP address:
   ```powershell
   ipconfig
   ```

2. On mobile device (same network):
   - Navigate to `http://YOUR_IP:8080`

3. Test:
   - Touch controls
   - Swipe gestures
   - Responsive layout
   - Performance

## Performance Optimization

Already implemented:
- Vite for fast builds
- TypeScript for type safety
- Efficient collision detection
- Object cleanup to prevent memory leaks

Additional optimizations for production:
- Vite automatically minifies code
- Assets are optimized
- Code splitting is enabled

## Troubleshooting

### Build Errors

If you encounter build errors:

```powershell
# Clear node modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run build
```

### Runtime Errors

Check browser console (F12) for errors. Common issues:
- EventBus event name mismatches
- Missing physics bodies
- Incorrect file paths

### Mobile Issues

- Ensure touch events are working
- Check for console errors on mobile
- Verify responsive CSS breakpoints

## Updates and Maintenance

To update the game:

1. Make changes to source files
2. Test locally: `npm run dev`
3. Commit changes: `git add . && git commit -m "description"`
4. Push to GitHub: `git push`
5. If using GitHub Actions, it will auto-deploy
6. If using manual deployment: `npm run deploy`

## Future Enhancements

Consider adding:
- [ ] Sound effects and music
- [ ] More power-up types
- [ ] Different airplane skins
- [ ] Backend leaderboard
- [ ] PWA support for offline play
- [ ] More obstacle varieties
- [ ] Pause menu
- [ ] Settings panel

## Version Management & Cache Busting

### Version Numbering
Update the version in `package.json` for each deployment:
```json
{
  "version": "1.0.1"  // Increment for each deployment
}
```

### Automatic Cache Busting
Vite automatically generates unique hashes for JS/CSS files on each build:
- `index-DQ2KALDe.js` (hash changes with each build)
- `phaser-BUlrDfUd.js`

### Force Browser Update
If changes aren't visible after deployment, users need to hard refresh:
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`
- **Or**: DevTools → Application → Clear Storage

### Deployment Checklist
- [ ] Run tests: `npm run test:run`
- [ ] Type check: `npm run type-check`
- [ ] Lint: `npm run lint`
- [ ] Update version in `package.json`
- [ ] Build: `npm run build`
- [ ] Deploy: `npm run deploy`
- [ ] Verify at https://izep.github.io/slide-plane/
- [ ] Hard refresh browser to see changes

---

**Game is ready to play!** Start with `npm run dev` to test locally.
