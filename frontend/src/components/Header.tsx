import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, X, LogOut, User, Settings, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../lib/api';

// ── Profile Edit Modal ────────────────────────────────────────────────────────
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
              className="w-full bg-surfaceHighlight/40 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain placeholder-textMuted/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_18px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surfaceHighlight/40 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain placeholder-textMuted/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_18px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans"
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

// ── Header ─────────────────────────────────────────────────────────────────────
const Header: React.FC = () => {
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
  const role = user?.role === 'Manager' ? 'Risk Director' : (user?.role || 'Risk Director');
  const initials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}

      <header className="h-16 border-b border-white/5 bg-[#0e0b1a]/60 backdrop-blur-xl flex items-center px-6 justify-between flex-shrink-0 sticky top-0 z-30 font-sans">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative hidden md:block group">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search customers, loans, predictions..."
            className="bg-white/[0.04] border border-white/8 rounded-xl pl-9 pr-12 py-1.5 text-sm text-textMain placeholder-textMuted/60 focus:outline-none focus:border-primary/50 w-[320px] focus:w-[380px] focus:bg-[#1a1628]/80 focus:shadow-[0_0_20px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors">
              <X size={14} />
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-textMuted/40 border border-white/8 px-1.5 py-0.5 rounded bg-white/[0.03]">⌘K</span>
          )}
        </form>

        {/* Right Controls */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Bell */}
          <button className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/8 text-textMuted hover:text-textMain transition-all duration-300 group">
            <Bell size={17} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger animate-pulse shadow-[0_0_8px_#ff6b6b]" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/8 transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-purple p-[1px] shadow-md shadow-primary/15">
                <div className="w-full h-full rounded-[7px] bg-[#100e1a] flex items-center justify-center text-primary font-bold text-xs group-hover:scale-105 transition-transform duration-300 font-sans">
                  {initials}
                </div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-textMain leading-none group-hover:text-primary transition-colors duration-300 font-sans">{userName}</p>
                <p className="text-[9px] font-mono text-textMuted tracking-wider uppercase mt-0.5">{role}</p>
              </div>
              <ChevronDown size={13} className={`text-textMuted transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 glass-3d-card !p-0 overflow-hidden z-50 animate-fade-in-up">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <p className="text-sm font-semibold text-textMain font-sans truncate">{userName}</p>
                  <p className="text-[10px] text-textMuted font-mono mt-0.5 truncate">{user?.email || 'manager@idbi.com'}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1.5 px-1.5">
                  <button
                    onClick={() => { setDropdownOpen(false); setProfileOpen(true); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-textMuted hover:text-textMain hover:bg-white/[0.05] transition-all duration-200 font-sans"
                  >
                    <User size={15} className="text-primary" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/app/settings'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-textMuted hover:text-textMain hover:bg-white/[0.05] transition-all duration-200 font-sans"
                  >
                    <Settings size={15} className="text-primary" />
                    Settings
                  </button>
                </div>

                {/* Logout */}
                <div className="px-1.5 pb-1.5 border-t border-white/5 pt-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition-all duration-200 font-sans font-semibold"
                  >
                    <LogOut size={15} />
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

export default Header;
