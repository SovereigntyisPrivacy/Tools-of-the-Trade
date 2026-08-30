import React, { useEffect, useRef, useState } from 'react';
import { App as CapApp } from '@capacitor/app';

// Minimal IndexedDB Wrapper for heavy video blobs (Bypasses 5MB LocalStorage limit)
const DB_NAME = 'tot_media_db';
const STORE_NAME = 'wallpapers';

const openDB = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = (e) => e.target.result.createObjectStore(STORE_NAME);
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

export const saveVideoWallpaper = async (blob) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(blob, 'custom_video');
  localStorage.setItem('fleet_wallpaper', 'Custom Video');
  window.dispatchEvent(new Event('video-wallpaper-updated'));
};

export default function LiveWallpaper() {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      if (localStorage.getItem('fleet_wallpaper') !== 'Custom Video') {
        setVideoUrl(null);
        return;
      }
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const request = tx.objectStore(STORE_NAME).get('custom_video');
        request.onsuccess = () => {
          if (request.result) {
            // Converts the stored blob into a playable local URL
            const url = URL.createObjectURL(request.result);
            setVideoUrl(url);
          }
        };
      } catch (e) {}
    };

    loadVideo();
    window.addEventListener('video-wallpaper-updated', loadVideo);
    window.addEventListener('storage', loadVideo);

    // Native OS hook: Pauses video instantly when app goes to background
    const appStateListener = CapApp.addListener('appStateChange', (state) => {
      setIsActive(state.isActive);
    });

    return () => {
      window.removeEventListener('video-wallpaper-updated', loadVideo);
      window.removeEventListener('storage', loadVideo);
      appStateListener.then(l => l.remove());
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) videoRef.current.play().catch(()=>{});
      else videoRef.current.pause();
    }
  }, [isActive, videoUrl]);

  if (!videoUrl) return null;

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      autoPlay loop muted playsInline
      style={{ 
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
        objectFit: 'cover', zIndex: -1, pointerEvents: 'none', opacity: 0.5 
      }}
    />
  );
}
