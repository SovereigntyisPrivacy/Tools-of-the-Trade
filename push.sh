#!/bin/bash
echo "🚀 Bumping Google Play Version Code..."
node -e "
const fs = require('fs');
const file = 'android/app/build.gradle';
if(fs.existsSync(file)) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/versionCode\s+(\d+)/, (match, v) => 'versionCode ' + (parseInt(v) + 1));
  fs.writeFileSync(file, code);
  console.log('✅ Android versionCode bumped successfully!');
} else {
  console.log('⚠️ android/app/build.gradle not found.');
}
"

echo "📦 Building and Syncing..."
npm run build && npx cap sync android

echo "🐙 Pushing to GitHub..."
git add .
git commit -m "feat: god mode generator and omni-scanner upgrades"
git push origin main

echo "🎉 ALL DONE!"
