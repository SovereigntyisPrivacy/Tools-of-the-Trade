import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GhostTap() {
  const navigate = useNavigate();
  const [taps, setTaps] = useState(0);
  const timeoutRef = useRef(null);

  const handleTap = () => {
    const newTaps = taps + 1;
    setTaps(newTaps);
    
    if (newTaps >= 4) {
      setTaps(0);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      navigate('/settings');
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setTaps(0), 1500);
  };

  return (
    <div 
      onClick={handleTap} 
      style={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '70px', zIndex: 9999 }} 
    />
  );
}
