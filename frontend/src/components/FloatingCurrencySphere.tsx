import { Shield } from 'lucide-react';

const FloatingCurrencySphere: React.FC = () => {
  return (
    <div className="relative flex items-center justify-between p-5 border border-primary/25 bg-gradient-to-tr from-primary/5 via-[#18122b]/95 to-accent-purple/5 backdrop-blur-md rounded-2xl overflow-hidden group h-full min-h-[140px] select-none">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none" />

      {/* Floating Ambient Glow */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-primary/10 via-[#da77f2]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Left Info Panel */}
      <div className="flex-1 z-10 pr-4">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={13} className="text-primary animate-pulse" />
          <span className="text-[9px] font-mono tracking-widest text-textMuted/60 uppercase">Portfolio Asset Security</span>
        </div>
        <h4 className="text-base md:text-lg font-serif font-semibold text-textMain leading-tight">
          Active Exposure Monitor
        </h4>
        <p className="text-[10px] text-textMuted/50 font-sans mt-1">
          Simulating exposure distribution and threat vectors in real-time.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/15 border border-success/20 text-success text-[9px] font-mono uppercase tracking-wider font-semibold">
            <span className="w-1 h-1 rounded-full bg-success animate-ping" />
            Active
          </span>
          <span className="text-[9px] font-mono text-textMuted/45">₹8,420 Cr SECURE</span>
        </div>
      </div>

      {/* Right 3D Sphere Graphics Container */}
      <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center flex-shrink-0 z-10">
        
        {/* Outer Pulsing Backdrop Glow */}
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent-purple opacity-20 blur-2xl animate-pulse-glow" />

        {/* 3D Orbital Ring 1 (Inner, Clockwise) with rotating particles */}
        <div 
          className="absolute rounded-full border border-primary/20 animate-spin-slow pointer-events-none w-24 h-10"
          style={{
            transform: 'rotateX(75deg) rotateY(15deg)',
            boxShadow: 'inset 0 0 10px rgba(177,151,252, 0.05)'
          }}
        >
          {/* Orbital Node: ₹ symbol */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold text-primary-glow font-mono bg-[#140e2b] px-1 rounded-full border border-primary/20 shadow-[0_0_10px_rgba(229,153,247,0.3)]">
            ₹
          </div>
        </div>

        {/* 3D Orbital Ring 2 (Outer, Counter-Clockwise) */}
        <div 
          className="absolute rounded-full border border-accent-purple/20 animate-spin-reverse pointer-events-none w-28 h-12"
          style={{
            transform: 'rotateX(60deg) rotateY(-15deg)',
            boxShadow: 'inset 0 0 10px rgba(192, 132, 252, 0.05)'
          }}
        >
          {/* Orbital Node: Coin Dot */}
          <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-accent-purple shadow-[0_0_8px_#c084fc]" />
        </div>

        {/* Floating Glass Sphere Body */}
        <div className="relative animate-float flex items-center justify-center">
          <div 
            className="w-20 h-20 rounded-full relative overflow-hidden flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 35%, rgba(229,208,255,0.22) 0%, rgba(177,151,252,0.12) 30%, rgba(124,58,237,0.06) 65%, rgba(20,16,35,0.92) 100%)',
              border: '1.5px solid rgba(229,208,255,0.28)',
              boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.6), inset 5px 5px 15px rgba(255,255,255,0.2), 0 10px 25px rgba(177,151,252,0.15)',
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

            {/* Moving Reflections */}
            <div className="absolute top-[12%] right-[15%] w-2 h-2 rounded-full bg-white/20 blur-[1px] animate-pulse" />

            {/* Inner Floating Currency Elements */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 animate-pulse-glow" style={{ animationDuration: '4s' }}>
              <span className="text-xl font-serif font-bold text-textMain leading-none tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#f8f0fc] to-[#da77f2] glow-text-lavender">
                ₹
              </span>
              <div className="flex gap-1.5 justify-center items-center opacity-60">
                <span className="text-[7px] font-mono text-[#20c997]">$</span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span className="text-[7px] font-mono text-warning">€</span>
              </div>
            </div>

            {/* Bottom backlight inside sphere */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-primary/20 to-transparent"
              style={{ filter: 'blur(2px)' }}
            />
          </div>

          {/* Tiny glowing dots circulating inside sphere (simulated via absolute placements) */}
          <div className="absolute w-1.5 h-1.5 rounded-full bg-success/60 blur-[0.5px] animate-pulse" style={{ top: '25%', right: '25%', animationDelay: '1s' }} />
          <div className="absolute w-1 h-1 rounded-full bg-primary/70 blur-[0.5px] animate-pulse" style={{ bottom: '25%', left: '20%', animationDelay: '2.5s' }} />
        </div>
      </div>
    </div>
  );
};

export default FloatingCurrencySphere;
