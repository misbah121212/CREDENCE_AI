import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShieldCheck } from 'lucide-react';

interface DigitalBankVaultProps {
  onUnlockComplete?: () => void;
}

const DigitalBankVault: React.FC<DigitalBankVaultProps> = ({ onUnlockComplete }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerUnlockSequence = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Unlocking sequence
    setTimeout(() => {
      setIsUnlocked(true);
      if (onUnlockComplete) onUnlockComplete();
    }, 800);

    // Relock sequence after showing blue light
    setTimeout(() => {
      setIsUnlocked(false);
    }, 3800);

    setTimeout(() => {
      setIsAnimating(false);
    }, 4500);
  };

  // Run automatically on mount to simulate initial analysis completing
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerUnlockSequence();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      onClick={triggerUnlockSequence}
      className="relative flex items-center justify-between p-5 border border-primary/25 bg-gradient-to-tr from-primary/5 via-[#18122b]/95 to-accent-purple/5 backdrop-blur-md rounded-2xl overflow-hidden group cursor-pointer h-full min-h-[140px]"
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none" />

      {/* Floating Particles in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-1 h-1 rounded-full bg-primary/40 top-[20%] left-[30%] animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-accent-purple/35 top-[70%] left-[15%] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute w-1 h-1 rounded-full bg-success/40 top-[40%] right-[35%] animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-primary/30 top-[80%] right-[20%] animate-pulse" style={{ animationDuration: '5s' }} />
      </div>

      {/* Glowing Soft Blue/Violet Backlight (emerges on unlock) */}
      <div 
        className={`absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-cyan-500/20 via-primary/10 to-transparent blur-2xl transition-all duration-1000 pointer-events-none ${
          isUnlocked ? 'scale-150 opacity-100' : 'scale-50 opacity-0'
        }`}
      />

      {/* Left Info Panel */}
      <div className="flex-1 z-10 pr-4 select-none">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={13} className={`${isUnlocked ? 'text-cyan-400' : 'text-primary'} transition-colors duration-500`} />
          <span className="text-[9px] font-mono tracking-widest text-textMuted/60 uppercase">Security Vault</span>
        </div>
        <h4 className="text-base md:text-lg font-serif font-semibold text-textMain leading-tight">
          {isUnlocked ? 'Vault Decrypted' : 'Digital Bank Vault'}
        </h4>
        
        {/* Status indicator */}
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-wider font-semibold transition-all duration-500 ${
            isUnlocked 
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
              : 'bg-primary/10 border-primary/20 text-primary'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isUnlocked ? 'bg-cyan-400 animate-ping' : 'bg-primary animate-pulse'}`} />
            {isUnlocked ? 'Secure Access Open' : 'Monitoring Integrity'}
          </span>
          <span className="text-[9px] font-mono text-textMuted/40 hidden sm:inline">v4.2-AES</span>
        </div>
      </div>

      {/* Right 3D Vault Graphics Container */}
      <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center flex-shrink-0 z-10">
        
        {/* Outer Rotating Vault Ring */}
        <div 
          className={`absolute inset-1 rounded-full border border-white/5 bg-white/[0.01] shadow-inner transition-transform pointer-events-none ${
            isAnimating ? 'animate-spin-slow' : 'rotate-6 group-hover:rotate-12 transition-transform duration-700'
          }`}
          style={{
            transform: `rotate(${isAnimating ? 360 : 0}deg)`,
            transition: isAnimating ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: 'inset 0 0 12px rgba(255,255,255,0.03)'
          }}
        >
          {/* Bolt notches around the perimeter */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div 
              key={deg}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/20 border border-black/30"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-46px)`
              }}
            />
          ))}
        </div>

        {/* 3D Glass Vault Door Body */}
        <div 
          className="absolute inset-4 rounded-full flex items-center justify-center transition-all duration-700"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(229,208,255,0.18) 0%, rgba(177,151,252,0.08) 50%, rgba(20,16,35,0.85) 100%)',
            border: '1.5px solid rgba(229,208,255,0.18)',
            boxShadow: `
              inset -4px -4px 12px rgba(0,0,0,0.6), 
              inset 4px 4px 12px rgba(255,255,255,0.15), 
              0 8px 24px rgba(0,0,0,0.4),
              ${isUnlocked ? '0 0 25px rgba(6,182,212,0.25)' : '0 0 15px rgba(177,151,252,0.1)'}
            `
          }}
        >
          {/* Specular Glare/Reflection Curve */}
          <div 
            className="absolute top-[8%] left-[10%] w-[80%] h-[35%] rounded-full bg-gradient-to-b from-white/35 to-white/0 pointer-events-none"
            style={{
              transform: 'rotate(-15deg)',
              filter: 'blur(0.5px)'
            }}
          />

          {/* Inner Locking Spokes (rotates opposite direction when unlocking) */}
          <div 
            className="absolute w-14 h-14 rounded-full flex items-center justify-center transition-all duration-1000"
            style={{
              transform: `rotate(${isUnlocked ? -90 : 0}deg)`
            }}
          >
            {[0, 120, 240].map((deg) => (
              <div 
                key={deg} 
                className={`absolute w-1 h-12 bg-gradient-to-b from-white/20 via-white/5 to-white/20 transition-colors duration-500 ${
                  isUnlocked ? 'from-cyan-400/40 to-cyan-400/40' : ''
                }`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${deg}deg)`
                }}
              />
            ))}
          </div>

          {/* Central Electronic Lock Dial */}
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-700 ${
              isUnlocked 
                ? 'bg-cyan-950/80 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                : 'bg-[#120a24]/90 border-primary/20 shadow-[0_0_8px_rgba(177,151,252,0.2)]'
            }`}
          >
            {isUnlocked ? (
              <Unlock size={12} className="text-cyan-400 animate-pulse" />
            ) : (
              <Lock size={12} className="text-primary/80 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalBankVault;
