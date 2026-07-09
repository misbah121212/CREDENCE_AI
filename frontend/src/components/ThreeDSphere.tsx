import React from 'react';

interface ThreeDSphereProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const ThreeDSphere: React.FC<ThreeDSphereProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: {
      sphere: 'w-24 h-24',
      shadow: 'w-20 h-3 bottom-[-15px]',
      ring1: 'w-36 h-12',
      ring2: 'w-40 h-16',
      glow: 'w-24 h-24 blur-xl'
    },
    md: {
      sphere: 'w-40 h-40 md:w-44 md:h-44',
      shadow: 'w-36 h-4 bottom-[-25px]',
      ring1: 'w-60 h-20',
      ring2: 'w-64 h-24',
      glow: 'w-40 h-40 blur-2xl'
    },
    lg: {
      sphere: 'w-60 h-60',
      shadow: 'w-52 h-6 bottom-[-35px]',
      ring1: 'w-80 h-28',
      ring2: 'w-96 h-36',
      glow: 'w-60 h-60 blur-3xl'
    }
  }[size];

  return (
    <div className="relative flex items-center justify-center py-6 select-none">
      {/* €€ Outer Pulsing Backdrop Glow €€ */}
      <div 
        className={`absolute rounded-full bg-gradient-to-tr from-primary to-accent-purple opacity-20 animate-pulse-glow ${sizeClasses.glow}`}
      />

      {/* €€ 3D Orbital Ring 1 (Inner, Clockwise) €€ */}
      <div 
        className={`absolute rounded-full border border-primary/20 animate-spin-slow pointer-events-none ${sizeClasses.ring1}`}
        style={{
          transform: 'rotateX(75deg) rotateY(15deg)',
          boxShadow: 'inset 0 0 15px rgba(177,151,252, 0.05), 0 0 15px rgba(177,151,252, 0.05)'
        }}
      >
        {/* Orbital Node */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary glow-text-lavender shadow-[0_0_10px_#b197fc]" />
      </div>

      {/* €€ 3D Orbital Ring 2 (Outer, Counter-Clockwise) €€ */}
      <div 
        className={`absolute rounded-full border border-accent-purple/20 animate-spin-reverse pointer-events-none ${sizeClasses.ring2}`}
        style={{
          transform: 'rotateX(65deg) rotateY(-15deg)',
          boxShadow: 'inset 0 0 20px rgba(192, 132, 252, 0.05), 0 0 20px rgba(192, 132, 252, 0.05)'
        }}
      >
        {/* Orbital Node */}
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent-purple glow-text-purple shadow-[0_0_12px_#c084fc]" />
      </div>

      {/* ——— Floating Sphere Container ——— */}
      <div className="relative animate-float flex items-center justify-center">
        {/* ——— The 3D Sphere ——— */}
        <div 
          className={`rounded-full relative overflow-hidden flex items-center justify-center ${sizeClasses.sphere}`}
          style={{
            background: 'radial-gradient(circle at 35% 35%, #ede9fe 0%, #b197fc 30%, #7c3aed 65%, #1e0a3c 100%)',
            boxShadow: 'inset -8px -8px 24px rgba(0,0,0,0.75), inset 8px 8px 24px rgba(255,255,255,0.35), 0 10px 30px rgba(177,151,252,0.30)',
          }}
        >
          {/* Specular Glare/Reflection Curve */}
          <div 
            className="absolute top-[8%] left-[10%] w-[80%] h-[35%] rounded-full bg-gradient-to-b from-white/60 to-white/0"
            style={{
              transform: 'rotate(-15deg)',
              filter: 'blur(1px)'
            }}
          />

          {/* Bottom bounce secondary glow (ambient backlight) */}
          <div 
            className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-accent-purple/40 to-transparent"
            style={{
              filter: 'blur(4px)'
            }}
          />

          {/* Centered Text Overlay */}
          {text && (
            <div className="relative z-10 flex flex-col items-center justify-center select-none pointer-events-none opacity-95 animate-pulse text-center leading-none gap-1.5">
              {text.split('\n').map((line, index) => (
                <span 
                  key={index}
                  className={`font-serif text-[#140e2b] font-semibold text-center uppercase ${
                    index === 0 
                      ? 'text-[10px] tracking-[0.35em] opacity-75 translate-x-[0.175em]' 
                      : 'text-[13px] md:text-[14px] tracking-[0.25em] translate-x-[0.125em]'
                  }`}
                >
                  {line}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* €€ Interactive Inner Core Particle (Simulating AI brain) €€ */}
        <div 
          className="absolute w-4 h-4 md:w-6 md:h-6 rounded-full bg-white opacity-80 blur-[2px] animate-ping"
          style={{
            top: '30%',
            left: '30%',
            boxShadow: '0 0 15px #ffffff, 0 0 30px #b197fc'
          }}
        />
      </div>

      {/* €€ Realistic Pulsing Drop Shadow €€ */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-black/60 blur-[6px] animate-float-delayed pointer-events-none ${sizeClasses.shadow}`}
        style={{
          transform: 'scaleX(1)',
          background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)'
        }}
      />
    </div>
  );
};

export default ThreeDSphere;

