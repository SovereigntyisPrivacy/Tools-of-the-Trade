#!/bin/bash
echo "🚀 Step 1: Bumping Android version numbers..."
node bump_version.cjs

echo "📦 Step 2: Compiling React UI..."
npm run build

echo "🔄 Step 3: Syncing web assets to Capacitor..."
npx cap sync android

echo "☁️ Step 4: Pushing to GitHub to trigger remote build..."
git add .
git commit -m "build: bumped version code for Google Play V2 release"
git push

echo "🎉 DONE! Check your GitHub Actions tab to watch the AAB compile."
