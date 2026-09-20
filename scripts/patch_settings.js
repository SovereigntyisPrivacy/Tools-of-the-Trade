const fs = require('fs');
const file = 'src/views/Settings.jsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add the import for the DB saver at the top
if (!code.includes('saveVideoWallpaper')) {
  code = "import { saveVideoWallpaper } from '../core/LiveWallpaper';\n" + code;
}

// 2. Add the Video Upload handler logic
const videoHandler = `
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 75 * 1024 * 1024) return alert('Keep video under 75MB for optimal performance.');
    await saveVideoWallpaper(file);
    setWallpaper('Custom Video');
    window.location.reload();
  };
`;
if (!code.includes('handleVideoUpload')) {
  code = code.replace(/const handleImageUpload =/g, videoHandler + '\n  const handleImageUpload =');
}

// 3. Inject the UI button
const videoButton = `
            <label style={{ flex: 1, minWidth: '80px', padding: '10px 5px', background: wallpaper === 'Custom Video' ? accent : 'rgba(34,34,34,0.8)', color: wallpaper === 'Custom Video' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75em', textAlign: 'center', cursor: 'pointer' }}>
              Video + <input type="file" accept="video/mp4,video/webm" onChange={handleVideoUpload} style={{ display: 'none' }} />
            </label>
`;
if (!code.includes('Video +')) {
  code = code.replace(/(Gallery \+.*?<\/label>)/s, '$1' + videoButton);
}

fs.writeFileSync(file, code);
console.log('Settings patched successfully!');
