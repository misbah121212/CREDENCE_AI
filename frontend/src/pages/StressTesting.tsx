import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, Sliders } from 'lucide-react';

const StressTesting: React.FC = () => {
  const [interestRateHike, setInterestRateHike] = useState(1.5);
  const [inflationSpike, setInflationSpike] = useState(2.0);
  const [unemploymentSpike, setUnemploymentSpike] = useState(1.0);

  // Dynamic calculations based on sliders
  const baseDefaultRate = 2.4;
  const stressedDefaultRate = parseFloat(
    (baseDefaultRate + (interestRateHike * 0.8) + (inflationSpike * 0.5) + (unemploymentSpike * 1.2)).toFixed(2)
  );

  const exposureAtRisk = Math.round(8420 * (stressedDefaultRate / 100));
  const capitalAdequacyImpact = (15.2 - (stressedDefaultRate * 0.15)).toFixed(2);

  // Generate 12-month projections
  const projectionData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2026, i, 1).toLocaleDateString('en', { month: 'short' });
    const baseline = baseDefaultRate + Math.sin(i * 0.5) * 0.1;
    const factor = (i + 1) / 12;
    const stressed = baseline + ((stressedDefaultRate - baseDefaultRate) * factor);
    return {
      month,
      Baseline: parseFloat(baseline.toFixed(2)),
      Stressed: parseFloat(stressed.toFixed(2))
    };
  });

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6 font-sans">
      {/* Heading */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold">Risk Management Suite</span>
        <h1 className="text-2xl font-serif font-bold text-textMain tracking-tight mt-1">Economic Stress Simulator</h1>
        <p className="text-xs text-textMuted mt-1">Simulate macroeconomic shocks to project portfolio default probability and capital adequacy adjustments.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Column */}
        <div className="glass-3d-card p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Sliders size={16} className="text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-textMain">Simulation Controls</h3>
          </div>

          {/* Slider 1: Interest Rate Hike */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-textMuted font-light">Interest Rate Hike</span>
              <strong className="text-textMain font-mono">+{interestRateHike}% p.a.</strong>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={interestRateHike}
              onChange={e => setInterestRateHike(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-textMuted/50 font-mono">
              <span>0%</span><span>5%</span>
            </div>
          </div>

          {/* Slider 2: Inflation Spike */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-textMuted font-light">Inflation Index Spike</span>
              <strong className="text-textMain font-mono">+{inflationSpike}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="0.1"
              value={inflationSpike}
              onChange={e => setInflationSpike(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-textMuted/50 font-mono">
              <span>0%</span><span>6%</span>
            </div>
          </div>

          {/* Slider 3: Unemployment Spike */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-textMuted font-light">Unemployment Increase</span>
              <strong className="text-textMain font-mono">+{unemploymentSpike}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.1"
              value={unemploymentSpike}
              onChange={e => setUnemploymentSpike(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-textMuted/50 font-mono">
              <span>0%</span><span>4%</span>
            </div>
          </div>

          {/* Warning Banner */}
          {stressedDefaultRate > 4 && (
            <div className="flex gap-2.5 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs leading-relaxed">
              <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
              <span><strong>Warning: Stressed Default Rate exceeds critical limits.</strong> Capital adequacy ratios may fall below statutory thresholds. Restructuring mandates suggested.</span>
            </div>
          )}
        </div>

        {/* Results Graph Column */}
        <div className="lg:col-span-2 glass-3d-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-textMuted">Stressed Probability Timeline</h3>
            <p className="text-xs text-textMuted mt-1">12-Month projection under active shock parameters</p>
          </div>

          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="glow-base" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="glow-stress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.1)" tick={{ fill: '#6B7280', fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: '#6B7280', fontSize: 10 }} domain={[1, 7]} />
                <Tooltip contentStyle={{ backgroundColor: '#100e1a', borderColor: '#222' }} />
                <Area type="monotone" dataKey="Baseline" stroke="#10b981" strokeWidth={2} fill="url(#glow-base)" />
                <Area type="monotone" dataKey="Stressed" stroke="#ef4444" strokeWidth={2} fill="url(#glow-stress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel text-center py-5">
          <p className="text-[10px] font-mono tracking-wider uppercase text-textMuted mb-2">Simulated Default Rate</p>
          <h3 className={`text-3xl font-bold font-mono ${stressedDefaultRate > 4 ? 'text-danger' : 'text-textMain'}`}>
            {stressedDefaultRate}%
          </h3>
          <p className="text-[10px] text-textMuted mt-1 font-light">Baseline: {baseDefaultRate}%</p>
        </div>

        <div className="glass-panel text-center py-5">
          <p className="text-[10px] font-mono tracking-wider uppercase text-textMuted mb-2">Simulated Exposure at Risk</p>
          <h3 className="text-3xl font-bold font-mono text-textMain">
            ₹{exposureAtRisk} Cr
          </h3>
          <p className="text-[10px] text-textMuted mt-1 font-light">Baseline: ₹202 Cr</p>
        </div>

        <div className="glass-panel text-center py-5">
          <p className="text-[10px] font-mono tracking-wider uppercase text-textMuted mb-2">Projected CAR Ratio</p>
          <h3 className="text-3xl font-bold font-mono text-success">
            {capitalAdequacyImpact}%
          </h3>
          <p className="text-[10px] text-textMuted mt-1 font-light">Regulatory Limit: 11.5%</p>
        </div>
      </div>
    </div>
  );
};

export default StressTesting;
