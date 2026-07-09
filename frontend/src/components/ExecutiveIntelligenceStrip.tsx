import React from 'react';
import { Cpu, CheckSquare, Network, RefreshCw } from 'lucide-react';
import TiltCard from './TiltCard';
import AnimatedGlobe from './AnimatedGlobe';

const ExecutiveIntelligenceStrip: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
      
      {/* LEFT SIDE: ANIMATED GLOBE */}
      <div className="flex-shrink-0 self-center">
        <TiltCard>
          <AnimatedGlobe />
        </TiltCard>
      </div>

      {/* RIGHT SIDE: THREE OPERATIONAL CARDS */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: TODAY'S OPERATIONS */}
        <TiltCard className="h-full">
          <div className="glass-3d-card p-5 h-full flex flex-col justify-between border border-white/8 bg-gradient-to-tr from-primary/5 via-[#18122b]/80 to-accent-purple/5 backdrop-blur-md rounded-2xl relative overflow-hidden group min-h-[195px] select-none">
            <div className="absolute top-[-10%] right-[-10%] w-20 h-20 bg-[#c084fc]/5 rounded-full blur-xl group-hover:bg-[#c084fc]/10 transition-all duration-700 pointer-events-none" />
            
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <CheckSquare size={13} className="text-accent-purple" />
                <span className="text-[9px] font-mono tracking-widest text-textMuted/60 uppercase">TODAY'S OPERATIONS</span>
              </div>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-success/15 border border-success/30 text-success font-semibold">84% COMPLETED</span>
            </div>

            <div className="my-auto py-1 z-10 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between text-textMuted/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-success" /> Portfolio Scan
                </span>
                <span className="font-mono text-[9px] text-success/80">COMPLETED</span>
              </div>
              <div className="flex items-center justify-between text-textMuted/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-success" /> Predictions Generated
                </span>
                <span className="font-mono text-[9px] text-textMain/80 font-bold">1,002 RUN</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded bg-[#c084fc]/10 border border-[#c084fc]/25 text-textMain relative overflow-hidden shadow-[0_0_12px_rgba(192,132,252,0.15)] animate-pulse">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning animate-ping" /> Manual Reviews
                </span>
                <span className="font-mono text-[9px] font-bold text-warning">2 PENDING</span>
              </div>
              <div className="flex items-center justify-between text-textMuted/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary" /> Next AI Batch
                </span>
                <span className="font-mono text-[9px]">IN 45M</span>
              </div>
            </div>

            {/* Continuous Progress Bar */}
            <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden border border-white/5 z-10">
              <div className="bg-gradient-to-r from-primary to-accent-purple h-full rounded-full animate-progress-flow" style={{ width: '84%' }} />
            </div>
          </div>
        </TiltCard>

        {/* CARD 2: AI ENGINE STATUS */}
        <TiltCard className="h-full">
          <div className="glass-3d-card p-5 h-full flex flex-col justify-between border border-white/8 bg-gradient-to-tr from-primary/5 via-[#18122b]/80 to-accent-purple/5 backdrop-blur-md rounded-2xl relative overflow-hidden group min-h-[195px] select-none">
            <div className="absolute top-[-10%] right-[-10%] w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />
            
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Cpu size={13} className="text-primary" />
                <span className="text-[9px] font-mono tracking-widest text-textMuted/60 uppercase">AI ENGINE HEALTH</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[9px] text-success/80">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" /> RUNNING
              </div>
            </div>

            <div className="my-auto py-1 z-10 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[9px] font-mono text-textMuted/50 block">AI CONFIDENCE</span>
                <span className="text-xl font-bold text-textMain glow-text-lavender">96.8%</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-textMuted/50 block">LAST REFRESH</span>
                <span className="text-xs font-mono text-textMain/80 font-bold block mt-1">18S AGO</span>
              </div>
              
              {/* Simple Animated Waveform representation */}
              <div className="col-span-2 flex items-center justify-between bg-white/[0.02] border border-white/5 px-2.5 py-1.5 rounded-xl mt-1">
                <span className="text-[9px] font-mono text-textMuted/70 uppercase">Engine Activity</span>
                <div className="flex items-center gap-0.5 h-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
                    const delays = ['0.1s', '0.4s', '0.2s', '0.6s', '0.3s', '0.5s', '0.2s'];
                    const heights = ['h-2', 'h-4', 'h-3', 'h-4', 'h-2', 'h-3', 'h-1'];
                    return (
                      <span 
                        key={bar} 
                        className={`w-0.5 bg-primary/70 rounded-full animate-waveform ${heights[bar-1]}`}
                        style={{ animationDelay: delays[bar-1] }} 
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3 z-10 text-[9px] text-textMuted/50 font-mono">
              <span>MODEL: XGBOOST-V4.2</span>
              <span className="flex items-center gap-1"><RefreshCw size={9} className="animate-spin-slow" /> ACTIVE</span>
            </div>
          </div>
        </TiltCard>

        {/* CARD 3: GLOBAL BANKING NETWORK */}
        <TiltCard className="h-full">
          <div className="glass-3d-card p-5 h-full flex flex-col justify-between border border-white/8 bg-gradient-to-tr from-primary/5 via-[#18122b]/80 to-accent-purple/5 backdrop-blur-md rounded-2xl relative overflow-hidden group min-h-[195px] select-none">
            <div className="absolute top-[-10%] right-[-10%] w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />
            
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Network size={13} className="text-primary" />
                <span className="text-[9px] font-mono tracking-widest text-textMuted/60 uppercase">BANKING MONITOR</span>
              </div>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/8 text-textMuted/80 uppercase">GLOBAL</span>
            </div>

            {/* Overlay miniature globe stand/drawing in the background of information */}
            <div className="absolute right-2 top-[35%] w-24 h-24 opacity-30 pointer-events-none z-0">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                {/* Stand */}
                <ellipse cx="50" cy="90" rx="16" ry="3" fill="rgba(177,151,252,0.2)" />
                <path d="M 48 75 L 52 75 L 51 90 L 49 90 Z" fill="rgba(177,151,252,0.3)" />
                <path d="M 50 75 A 32 32 0 0 1 20 50 L 23 50 A 29 29 0 0 0 50 72 Z" fill="rgba(177,151,252,0.3)" />
                
                {/* Globe circle */}
                <circle cx="50" cy="45" r="26" fill="none" stroke="rgba(177,151,252,0.15)" strokeWidth="0.75" />
                <g className="animate-globe-rotate">
                  <path d="M 30 35 C 38 28 44 28 50 35 C 56 42 62 42 70 35 L 70 55 C 62 62 56 62 50 55 C 44 48 38 48 30 55 Z" fill="rgba(177,151,252,0.08)" stroke="rgba(177,151,252,0.12)" strokeWidth="0.5" />
                  <path d="M 120 35 C 128 28 134 28 140 35 C 146 42 152 42 160 35 L 160 55 C 152 62 146 62 140 55 C 134 48 128 48 120 55 Z" fill="rgba(177,151,252,0.08)" stroke="rgba(177,151,252,0.12)" strokeWidth="0.5" />
                </g>
                <ellipse cx="50" cy="45" rx="26" ry="8" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <ellipse cx="50" cy="45" rx="8" ry="26" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                
                {/* Slanted Orbit Line */}
                <g transform="rotate(-15 50 45)">
                  <ellipse cx="50" cy="45" rx="38" ry="12" fill="none" stroke="rgba(218,119,242,0.3)" strokeWidth="0.75" strokeDasharray="2 3" className="animate-spin-slow" style={{ animationDuration: '8s' }} />
                  <circle cx="20" cy="40" r="1.5" fill="#da77f2" />
                  <circle cx="80" cy="50" r="1.5" fill="#da77f2" />
                </g>
              </svg>
            </div>

            <div className="my-auto py-1 z-10 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-1">
                <span className="text-textMuted/70">Branches Online</span>
                <span className="font-mono text-textMain/90 font-bold">152 Active</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-1">
                <span className="text-textMuted/70">Customers Monitored</span>
                <span className="font-mono text-textMain/90 font-bold">1.28 M</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-1">
                <span className="text-textMuted/70">Loans Under Monitor</span>
                <span className="font-mono text-textMain/90 font-bold">482 K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-textMuted/70">Portfolio Value</span>
                <span className="font-mono text-primary-glow font-bold">₹8,420 Cr</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3 z-10 text-[9px] text-textMuted/50 font-mono">
              <span>NETWORK INTEGRITY: 100%</span>
              <span className="text-success/70 font-semibold">SECURE</span>
            </div>
          </div>
        </TiltCard>

      </div>
    </div>
  );
};

export default ExecutiveIntelligenceStrip;
