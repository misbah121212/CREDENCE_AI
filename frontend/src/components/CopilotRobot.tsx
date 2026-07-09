import React from 'react';

interface CopilotRobotProps {
  onOpenAssistant?: () => void;
}

const CopilotRobot: React.FC<CopilotRobotProps> = ({ onOpenAssistant }) => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Robot Mascot: Floating 3D Purple Clay Robot */}
      <div className="relative w-40 h-36 flex items-center justify-center animate-float group">
        {/* Soft shadow on the laptop / ground */}
        <div 
          className="absolute bottom-1 w-16 h-2 bg-black/45 rounded-full blur-[3px] animate-shadow-scale"
          style={{ transformOrigin: 'center center' }}
        />

        <svg 
          viewBox="0 0 160 160" 
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] transform group-hover:scale-[1.03] transition-transform duration-500"
        >
          {/* ROBOT MASS */}
          <g id="clay-robot">
            
            {/* FLOATING DETACHED ARMS */}
            {/* Left Arm: Waving upward/outward */}
            <g className="animate-waving-arm" style={{ transformOrigin: '48px 100px' }}>
              <ellipse 
                cx="32" 
                cy="88" 
                rx="9" 
                ry="18" 
                fill="url(#purple-clay-grad)" 
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
                transform="rotate(-30 32 88)" 
              />
              {/* Inner arm shadow for 3D depth */}
              <ellipse 
                cx="34" 
                cy="90" 
                rx="6" 
                ry="14" 
                fill="url(#purple-clay-shadow)" 
                opacity="0.6"
                transform="rotate(-30 32 88)" 
              />
            </g>

            {/* Right Arm: Hanging downward/outward */}
            <g>
              <ellipse 
                cx="128" 
                cy="102" 
                rx="9" 
                ry="18" 
                fill="url(#purple-clay-grad)" 
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
                transform="rotate(15 128 102)" 
              />
              {/* Inner arm shadow */}
              <ellipse 
                cx="126" 
                cy="104" 
                rx="6" 
                ry="14" 
                fill="url(#purple-clay-shadow)" 
                opacity="0.6"
                transform="rotate(15 128 102)" 
              />
            </g>

            {/* Torso: Pebble-like rounded body */}
            <path 
              d="M 54 90 C 54 74 106 74 106 90 L 102 126 C 102 138 58 138 58 126 Z" 
              fill="url(#purple-clay-grad)" 
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.5"
            />
            {/* Soft inner shadow on torso for 3D clay look */}
            <path 
              d="M 58 94 C 58 82 102 82 102 94 L 98 124 C 98 132 62 132 62 124 Z" 
              fill="url(#purple-clay-shadow)" 
              opacity="0.75"
            />
            {/* Glossy specular shine on torso */}
            <ellipse cx="80" cy="88" rx="20" ry="6" fill="#ffffff" opacity="0.12" />

            {/* Head/Helmet (Bobs and rotates slightly) */}
            <g id="head" className="animate-head-bob">
              {/* Outer Helmet shell: Rounded rectangular glossy purple shape */}
              <rect 
                x="36" 
                y="26" 
                width="88" 
                height="62" 
                rx="28" 
                fill="url(#purple-clay-grad)" 
                stroke="rgba(255,255,255,0.18)" 
                strokeWidth="0.75"
              />
              
              {/* Outer Helmet inner shadow for volumetric depth */}
              <rect 
                x="40" 
                y="30" 
                width="80" 
                height="54" 
                rx="24" 
                fill="url(#purple-clay-shadow)" 
                opacity="0.75"
              />

              {/* Visor Screen: Glossy black rounded rectangle */}
              <rect 
                x="44" 
                y="33" 
                width="72" 
                height="48" 
                rx="20" 
                fill="url(#visor-screen-grad)" 
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
              />

              {/* Glowing Eyes: Neon cyan happy arches (^ ^) */}
              <g stroke="#67e8f9" strokeWidth="3.5" strokeLinecap="round" fill="none" className="animate-eye-pulse">
                {/* Left arch eye */}
                <path d="M 54 57 Q 62 48 70 57" />
                {/* Right arch eye */}
                <path d="M 90 57 Q 98 48 106 57" />
              </g>

              {/* Glossy Reflection Overlay on the visor screen */}
              <path 
                d="M 44 33 L 116 33 A 20 20 0 0 1 116 73 L 70 73 Z" 
                fill="url(#visor-shine-grad)" 
                opacity="0.25"
                pointerEvents="none"
              />
            </g>

          </g>

          {/* Definitions for clay-look gradients */}
          <defs>
            {/* Volumetric Purple Clay Gradient */}
            <linearGradient id="purple-clay-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d0bfff" />     {/* Bright highlights */}
              <stop offset="30%" stopColor="#b197fc" />    {/* Main body tone */}
              <stop offset="75%" stopColor="#9775fa" />    {/* Core purple */}
              <stop offset="100%" stopColor="#7048e8" />   {/* Deep shadow */}
            </linearGradient>

            {/* Inner volumetric shadow for clay depth */}
            <linearGradient id="purple-clay-shadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9775fa" stopOpacity="0" />
              <stop offset="100%" stopColor="#5f3dc4" stopOpacity="0.85" />
            </linearGradient>

            {/* Visor Screen Background */}
            <linearGradient id="visor-screen-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1b2e" />
              <stop offset="100%" stopColor="#0a0814" />
            </linearGradient>

            {/* Glass shine gradient */}
            <linearGradient id="visor-shine-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Message box below the robot */}
      <div 
        onClick={onOpenAssistant}
        className="w-full mt-3 p-3 rounded-xl border border-white/8 bg-gradient-to-br from-[#1b1236]/90 to-[#0c081d]/95 backdrop-blur-md shadow-md text-center cursor-pointer hover:border-primary/30 transition duration-300 relative overflow-hidden group/box"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/box:opacity-100 transition duration-300 pointer-events-none" />
        <p className="text-[10px] text-textMain/90 font-sans leading-normal relative z-10">
          "Hi! I'm your AI Copilot. Let me know if you need help with loan predictions!"
        </p>
      </div>
    </div>
  );
};

export default CopilotRobot;
