import React from 'react';

const AnimatedGlobe: React.FC = () => {
  return (
    <div className="relative w-56 h-56 md:w-60 md:h-60 flex items-center justify-center select-none pointer-events-none">
      {/* Glow effect behind the globe */}
      <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-primary/20 to-accent-purple/20 blur-3xl opacity-60 animate-pulse-glow" />

      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Sleek Metallic Globe Stand */}
        {/* Base */}
        <ellipse 
          cx="100" 
          cy="185" 
          rx="35" 
          ry="6" 
          fill="url(#stand-base-grad)" 
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />
        <path 
          d="M 98 180 L 102 180 L 102 185 L 98 185 Z" 
          fill="url(#metallic-grad)" 
        />
        
        {/* Vertical Shaft */}
        <path 
          d="M 97 150 L 103 150 L 101 180 L 99 180 Z" 
          fill="url(#metallic-grad)" 
        />

        {/* Semi-circular Arm (Holding the globe on a slant) */}
        <path 
          d="M 100 150 A 65 65 0 0 1 42 100 A 65 65 0 0 1 100 35 L 100 41 A 59 59 0 0 0 48 100 A 59 59 0 0 0 100 144 Z" 
          fill="url(#metallic-grad)"
          transform="rotate(-23.5 100 100)"
        />

        {/* Axis Pins (Top & Bottom poles) */}
        <line x1="100" y1="30" x2="100" y2="40" stroke="url(#metallic-grad)" strokeWidth="3" strokeLinecap="round" transform="rotate(-23.5 100 100)" />
        <line x1="100" y1="160" x2="100" y2="170" stroke="url(#metallic-grad)" strokeWidth="3" strokeLinecap="round" transform="rotate(-23.5 100 100)" />

        {/* The Globe Sphere Group (Tilted at 23.5 degrees) */}
        <g transform="rotate(-23.5 100 100)">
          {/* Sphere Backing & Base Shadow */}
          <circle cx="100" cy="100" r="54" fill="#0f0c1b" />
          
          {/* Globe body with premium radial color gradient */}
          <circle 
            cx="100" 
            cy="100" 
            r="54" 
            fill="url(#globe-radial-grad)" 
            stroke="rgba(229,208,255,0.15)"
            strokeWidth="1"
          />

          {/* Continent details (Vector lines moving to simulate rotation) */}
          <g className="animate-globe-rotate" style={{ mask: 'url(#globe-mask)' }}>
            {/* Mask for containing continents inside the circle */}
            <mask id="globe-mask">
              <circle cx="100" cy="100" r="54" fill="white" />
            </mask>

            {/* Continent shapes group (duplicated for seamless wrapping) */}
            <g fill="rgba(177,151,252,0.12)" stroke="rgba(177,151,252,0.25)" strokeWidth="0.75">
              {/* Set 1 */}
              <path d="M 30 70 Q 40 50 60 60 T 90 70 T 110 50 T 140 60 T 170 80 L 170 120 Q 150 130 130 110 T 90 120 T 50 110 T 30 90 Z" />
              <path d="M 50 40 Q 70 30 80 45 T 110 40 T 130 35 L 135 50 Q 110 55 90 48 Z" />
              <path d="M 80 130 Q 100 140 120 135 T 140 150 L 130 160 Q 100 155 80 145 Z" />

              {/* Set 2 (Offset to the right by 180px for seamless loop) */}
              <path d="M 210 70 Q 220 50 240 60 T 270 70 T 290 50 T 320 60 T 350 80 L 350 120 Q 330 130 310 110 T 270 120 T 230 110 T 210 90 Z" />
              <path d="M 230 40 Q 250 30 260 45 T 290 40 T 310 35 L 315 50 Q 290 55 270 48 Z" />
              <path d="M 260 130 Q 280 140 300 135 T 320 150 L 310 160 Q 280 155 260 145 Z" />
            </g>
          </g>

          {/* Grid lines (Latitude and Longitude overlay) */}
          {/* Latitudes */}
          <ellipse cx="100" cy="100" rx="54" ry="18" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <ellipse cx="100" cy="100" rx="54" ry="36" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <line x1="46" y1="100" x2="154" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
          {/* Longitudes */}
          <ellipse cx="100" cy="100" rx="18" ry="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <ellipse cx="100" cy="100" rx="36" ry="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

          {/* Glass sphere overlay specular glare for a glossy look */}
          <path 
            d="M 52 75 A 54 54 0 0 1 148 75 A 54 40 0 0 0 52 75 Z" 
            fill="url(#specular-grad)" 
            opacity="0.35"
          />
        </g>

        {/* Slanted revolving line of currency notes and symbols */}
        <g transform="rotate(-15 100 100)">
          {/* Path representing the slant orbit ring */}
          <ellipse 
            cx="100" 
            cy="100" 
            rx="85" 
            ry="25" 
            fill="none" 
            stroke="url(#orbit-line-grad)" 
            strokeWidth="1.25" 
            strokeDasharray="4 8"
            className="animate-spin-slow"
            style={{ animationDuration: '15s' }}
          />

          {/* Floating symbols revolving along the path */}
          <g className="animate-currency-orbit">
            <g transform="translate(100, 100)">
              {/* Rupee Symbol */}
              <g className="animate-orbit-item-1">
                <rect x="-10" y="-8" width="20" height="15" rx="3" fill="#140e2b" stroke="#cc5de8" strokeWidth="0.75" />
                <text x="0" y="3" textAnchor="middle" fill="#cc5de8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">₹</text>
              </g>

              {/* Dollar Symbol */}
              <g className="animate-orbit-item-2">
                <rect x="-10" y="-8" width="20" height="15" rx="3" fill="#140e2b" stroke="#20c997" strokeWidth="0.75" />
                <text x="0" y="3" textAnchor="middle" fill="#20c997" fontSize="10" fontWeight="bold" fontFamily="sans-serif">$</text>
              </g>

              {/* Euro Symbol */}
              <g className="animate-orbit-item-3">
                <rect x="-10" y="-8" width="20" height="15" rx="3" fill="#140e2b" stroke="#fab005" strokeWidth="0.75" />
                <text x="0" y="3" textAnchor="middle" fill="#fab005" fontSize="10" fontWeight="bold" fontFamily="sans-serif">€</text>
              </g>

              {/* Another Rupee note */}
              <g className="animate-orbit-item-4">
                <rect x="-10" y="-8" width="20" height="15" rx="3" fill="#140e2b" stroke="#da77f2" strokeWidth="0.75" />
                <text x="0" y="3" textAnchor="middle" fill="#da77f2" fontSize="10" fontWeight="bold" fontFamily="sans-serif">₹</text>
              </g>
            </g>
          </g>
        </g>

        {/* Definitions for Gradients */}
        <defs>
          <radialGradient id="globe-radial-grad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#2c1a4d" />
            <stop offset="60%" stopColor="#170c2a" />
            <stop offset="100%" stopColor="#080312" />
          </radialGradient>

          <linearGradient id="specular-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="metallic-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b197fc" />
            <stop offset="35%" stopColor="#4c367d" />
            <stop offset="70%" stopColor="#180e29" />
            <stop offset="100%" stopColor="#b197fc" />
          </linearGradient>

          <linearGradient id="stand-base-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#100a21" />
            <stop offset="50%" stopColor="#b197fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#100a21" />
          </linearGradient>

          <linearGradient id="orbit-line-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(204,93,232,0.1)" />
            <stop offset="50%" stopColor="rgba(204,93,232,0.6)" />
            <stop offset="100%" stopColor="rgba(218,119,242,0.1)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AnimatedGlobe;
