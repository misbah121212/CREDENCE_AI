import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Search, ChevronDown, X, LogOut, User, Check, 
  Shield, MessageSquareDot, LayoutDashboard, Users, CreditCard, 
  UploadCloud, BarChart2, FileText, Activity, AlertOctagon 
} from 'lucide-react';
import { clearToken } from '../lib/api';

// --- Profile Edit Modal ---
const ProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const userStr = localStorage.getItem('user_info');
  const user = userStr ? JSON.parse(userStr) : {};
  const [name, setName] = useState(user.user_name || '');
  const [email, setEmail] = useState(user.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = { ...user, user_name: name, email };
    localStorage.setItem('user_info', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="glass-3d-card w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-textMuted hover:text-textMain hover:bg-white/5 transition"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent-purple flex items-center justify-center text-white font-bold text-lg font-sans shadow-lg shadow-primary/20">
            {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-serif font-semibold text-textMain">Edit Profile</h3>
            <p className="text-xs text-textMuted font-mono mt-0.5">{user.role || 'Risk Director'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain placeholder-textMuted/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_18px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain placeholder-textMuted/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_18px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-textMuted bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition font-sans"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-accent-purple text-white shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2 font-sans"
          >
            {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- TopNavbar ---
interface TopNavbarProps {
  onOpenCopilot: () => void;
}

const navLinks = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/app/customers', icon: Users, label: 'Customers' },
  { to: '/app/loans', icon: CreditCard, label: 'Loans' },
  { to: '/app/upload', icon: UploadCloud, label: 'Data Upload' },
  { to: '/app/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/app/stress-testing', icon: Activity, label: 'Stress Simulator' },
  { to: '/app/fraud-detection', icon: AlertOctagon, label: 'Fraud Center' },
  { to: '/app/reports', icon: FileText, label: 'Reports' },
];

const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenCopilot }) => {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/app/customers?search=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('user_info');
    window.location.href = '/login';
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const userStr = localStorage.getItem('user_info');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.user_name || 'Bank Manager';
  const initials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}

      <header className="w-full border-b border-white/5 bg-[#0e0a1bbb]/80 backdrop-blur-2xl sticky top-0 z-30 font-sans flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-4">
        {/* Left Logo / Name */}
        <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => navigate('/app/dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-purple p-[1px] flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/25">
            <div className="w-full h-full rounded-[11px] bg-[#100e1a] flex items-center justify-center">
              <Shield size={18} className="text-primary animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-textMain tracking-tight leading-none">Credence</h2>
            <p className="text-[9px] text-primary/70 font-mono tracking-widest uppercase mt-0.5">AI · RISK PLATFORM</p>
          </div>
        </div>

        {/* Center Horizontal Menu */}
        <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto py-1 px-2 no-scrollbar scroll-smooth">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-sans transition-all duration-300 group relative flex-shrink-0
                 ${isActive
                   ? 'bg-gradient-to-tr from-primary/20 to-accent-purple/10 text-primary border-b border-primary/40 shadow-[0_0_12px_rgba(177,151,252,0.12)]'
                   : 'text-textMuted hover:bg-white/[0.03] hover:text-textMain'
                 }`
              }
            >
              <Icon size={14} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3.5 flex-shrink-0 ml-auto md:ml-0 w-full md:w-auto justify-end">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative group min-w-[200px] max-w-[280px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search..."
              className="bg-white/[0.04] border border-white/8 rounded-xl pl-9 pr-6 py-1.5 text-xs text-textMain placeholder-textMuted/60 focus:outline-none focus:border-primary/50 focus:bg-[#1a1628]/80 focus:shadow-[0_0_20px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans w-full"
            />
          </form>

          {/* Copilot Pulse Button */}
          <button 
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-xs font-bold text-primary transition duration-300 group shadow-md shadow-primary/5"
            title="Open Assistant (Ctrl+K)"
          >
            <div className="relative w-2 h-2 rounded-full bg-[#10b981]">
              <span className="absolute inset-0 rounded-full bg-[#10b981] animate-ping" />
            </div>
            <MessageSquareDot size={14} className="group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/8 transition-all duration-300 group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-accent-purple p-[1px]">
                <div className="w-full h-full rounded-[6px] bg-[#100e1a] flex items-center justify-center text-primary font-bold text-[10px] group-hover:scale-105 transition-transform duration-300 font-sans">
                  {initials}
                </div>
              </div>
              <ChevronDown size={12} className={`text-textMuted transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 glass-3d-card !p-0 overflow-hidden z-50 animate-fade-in-up">
                <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <p className="text-sm font-semibold text-textMain font-sans truncate">{userName}</p>
                  <p className="text-[10px] text-textMuted font-mono mt-0.5 truncate">{user?.email || 'manager@idbi.com'}</p>
                </div>

                <div className="py-1.5 px-1.5">
                  <button
                    onClick={() => { setDropdownOpen(false); setProfileOpen(true); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-textMuted hover:text-textMain hover:bg-white/[0.05] transition-all duration-200 font-sans"
                  >
                    <User size={14} className="text-primary" />
                    Edit Profile
                  </button>
                </div>

                <div className="px-1.5 pb-1.5 border-t border-white/5 pt-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-danger hover:bg-danger/10 transition-all duration-200 font-sans font-semibold"
                  >
                    <LogOut size={14} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default TopNavbar;
