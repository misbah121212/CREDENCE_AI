import React, { useEffect, useState } from 'react';
import ThreeDSphere from './ThreeDSphere';

const IntroLoader: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the intro animation in this browser session
    const hasSeenIntro = sessionStorage.getItem('credence_intro_seen');
    if (!hasSeenIntro) {
      setVisible(true);
      // Step 1: Play intro for 2.6 seconds
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2600);

      // Step 2: Unmount after fade-out transition (400ms)
      const removeTimer = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('credence_intro_seen', 'true');
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#06070a] flex flex-col items-center justify-center transition-all duration-700 ease-out select-none ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-purple/10 blur-[120px] animate-pulse-glow" />

      {/* Main animated group */}
      <div className="flex flex-col items-center gap-6 text-center z-10">
        {/* Glowing 3D Orb */}
        <div className="animate-scale-up">
          <ThreeDSphere size="lg" />
        </div>

        {/* Brand Text */}
        <div className="space-y-2 mt-4 animate-fade-in-up">
          <h1 
            className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-white glow-text-blue"
            style={{
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff 30%, #e0f2fe 70%, #b197fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            CREDENCE AI
          </h1>
          
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto my-3" />
          
          <p 
            className="text-sm font-sans text-textMuted tracking-[0.25em] uppercase font-light animate-pulse"
            style={{ animationDuration: '2s' }}
          >
            Predict · Protect · Prevent
          </p>
        </div>
      </div>

      {/* Futuristic status details at the bottom */}
      <div className="absolute bottom-10 font-mono text-[10px] text-primary/40 tracking-wider flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <span>ESTABLISHING SECURE AI CORE...</span>
        </div>
        <span>SYSTEM MODEL V4.2 · CORE ACTIVE</span>
      </div>
    </div>
  );
};

export default IntroLoader;

