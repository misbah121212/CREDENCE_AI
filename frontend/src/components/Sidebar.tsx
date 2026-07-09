import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, CreditCard, UploadCloud,
  BarChart2, FileText, Settings, ChevronLeft, ChevronRight,
  Shield, MessageSquareDot, Activity, AlertOctagon
} from 'lucide-react';

const navLinks = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/app/customers', icon: Users, label: 'Customers' },
  { to: '/app/loans', icon: CreditCard, label: 'Loans' },
  { to: '/app/upload', icon: UploadCloud, label: 'Data Upload' },
  { to: '/app/analytics', icon: BarChart2, label: 'Risk Analytics' },
  { to: '/app/stress-testing', icon: Activity, label: 'Stress Simulator' },
  { to: '/app/fraud-detection', icon: AlertOctagon, label: 'Fraud Center' },
  { to: '/app/reports', icon: FileText, label: 'Reports' },
];

const Sidebar: React.FC<{ collapsed: boolean; onToggle: () => void; onOpenCopilot?: () => void }> = ({ collapsed, onToggle, onOpenCopilot }) => {
  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } flex-shrink-0 hidden md:flex flex-col border-r border-white/5 bg-[#0e0b1a]/80 backdrop-blur-xl transition-all duration-300 relative z-20`}
    >
      {/* Glow highlight at the top of the sidebar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Logo Section */}
      <div className={`p-5 flex items-center ${collapsed ? 'justify-center' : 'gap-3'} border-b border-white/5`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-purple p-[1px] flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/20">
          <div className="w-full h-full rounded-[11px] bg-[#100e1a] flex items-center justify-center">
            <Shield size={18} className="text-primary animate-pulse" />
          </div>
        </div>
        {!collapsed && (
          <div>
            <h2 className="text-base font-serif font-bold text-textMain tracking-tight leading-none">Credence</h2>
            <p className="text-[10px] text-primary/70 font-mono tracking-widest uppercase mt-1">AI · ENTERPRISE</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-sans transition-all duration-300 group relative
               ${isActive
                 ? 'bg-gradient-to-r from-primary/15 to-accent-purple/5 text-primary border-l-2 border-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                 : 'text-textMuted hover:bg-white/[0.03] hover:text-textMain'
               }
               ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {!collapsed && <span className="tracking-tight">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Copilot Mini Card (Shown if not collapsed) */}
      {!collapsed && (
        <div className="px-3 py-3 m-2.5 rounded-2xl bg-gradient-to-b from-[#121522]/50 to-[#0a0b12]/50 border border-white/5 relative overflow-hidden group">
          {/* Subtle glowing orb in background */}
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-primary/10 blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-2">
            {/* Small 3D Orb design using CSS */}
            <div className="relative w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-tr from-primary to-accent-purple shadow-[0_0_12px_rgba(177,151,252,0.4)] animate-float">
              <div className="absolute inset-[1px] rounded-full bg-gradient-to-tr from-primary-glow to-transparent opacity-50" />
              <div className="absolute top-[10%] left-[15%] w-2 h-1 bg-white/60 rounded-full" style={{ transform: 'rotate(-20deg)' }} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-textMain leading-none">Credence Copilot</h4>
              <span className="text-[8px] text-[#10b981] font-medium flex items-center gap-1 mt-1">
                <span className="w-1 h-1 rounded-full bg-[#10b981] animate-ping" />
                Standing by - v4.2
              </span>
            </div>
          </div>
          
          <p className="text-[9px] text-textMuted leading-relaxed mb-2.5">
            Ask about any customer, portfolio segment, or risk cohort.
          </p>
          
          <button 
            onClick={onOpenCopilot}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#1c1f30] hover:bg-[#252a42] text-[10px] font-semibold text-textMain border border-white/5 transition duration-300"
          >
            <span className="flex items-center gap-1">
              <MessageSquareDot size={12} className="text-primary" />
              Open assistant
            </span>
            <span className="text-[8px] font-mono text-textMuted bg-[#0a0b12] px-1 rounded">Ctrl+K</span>
          </button>
        </div>
      )}

      {/* Settings + Collapse Toggle */}
      <div className="p-3 border-t border-white/5 space-y-1 bg-[#09071a]/40">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-sans transition-all duration-300
             ${isActive
               ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary'
               : 'text-textMuted hover:bg-white/[0.03] hover:text-textMain'
             }
             ${collapsed ? 'justify-center' : ''}`
          }
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-textMuted hover:bg-white/[0.02] hover:text-textMain transition duration-300"
        >
          {collapsed ? <ChevronRight size={18} className="mx-auto" /> : (
            <>
              <ChevronLeft size={18} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

