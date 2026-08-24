const fs = require('fs');

const gradlePath = 'android/app/build.gradle';
let gradle = fs.readFileSync(gradlePath, 'utf8');

// Bump versionCode (e.g., 1 -> 2)
gradle = gradle.replace(/versionCode\s+(\d+)/, (match, currentCode) => {
    const newCode = parseInt(currentCode, 10) + 1;
    console.log(`✅ Bumped versionCode to: ${newCode}`);
    return `versionCode ${newCode}`;
});

// Bump versionName (e.g., "1.0" -> "1.1")
gradle = gradle.replace(/versionName\s+"([^"]+)"/, (match, currentName) => {
    const parts = currentName.split('.');
    parts[parts.length - 1] = parseInt(parts[parts.length - 1], 10) + 1;
    const newName = parts.join('.');
    console.log(`✅ Bumped versionName to: "${newName}"`);
    return `versionName "${newName}"`;
});

fs.writeFileSync(gradlePath, gradle);
