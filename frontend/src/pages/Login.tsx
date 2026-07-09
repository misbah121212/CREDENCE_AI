import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle, UserPlus, LogIn, ChevronRight, Sparkles } from 'lucide-react';
import { authApi, setToken } from '../lib/api';
import ThreeDSphere from '../components/ThreeDSphere';
import TiltCard from '../components/TiltCard';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    authApi.getRoles().then(r => {
      setRoles(r);
      if (r.length > 0) setRoleId(r[0].id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const res = await authApi.login(email, password);
        setToken(res.access_token);
        localStorage.setItem('user_info', JSON.stringify({
          user_name: 'Bank Manager',
          email: email,
          role: 'Manager'
        }));
        navigate('/app/dashboard');
      } else {
        const res = await authApi.register({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role_id: roleId,
        });
        setToken(res.access_token);
        localStorage.setItem('user_info', JSON.stringify({
          user_name: `${firstName} ${lastName}`,
          email: email,
          role: 'Manager'
        }));
        navigate('/app/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0c0a14] overflow-x-hidden font-sans">
      {/* --- Left Panel — Graphics --- */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 bg-gradient-to-b from-[#181135] via-[#100b21] to-[#0e0a17] border-r border-white/5 relative overflow-hidden select-none">
        {/* Glow backdrop circles */}
        <div className="absolute top-[-10%] right-[-10%] w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-[-15%] left-[-15%] w-80 h-80 rounded-full bg-[#da77f2]/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-[#da77f2] p-[1px] shadow-lg shadow-primary/20">
            <div className="w-full h-full rounded-[11px] bg-[#100e1a] flex items-center justify-center">
              <Shield size={20} className="text-primary animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-textMain leading-none tracking-tight">Credence AI</h1>
            <p className="text-[10px] text-primary/70 font-mono tracking-widest uppercase mt-1">Loan Risk Intelligence</p>
          </div>
        </div>

        {/* 3D Sphere Display */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <ThreeDSphere size="lg" text={"CRAFTED BY\n2D DEVELOPERS"} />
        </div>

        {/* Bottom stats summary */}
        <div className="grid grid-cols-3 gap-4 relative z-10 mt-6">
          {[
            { value: 'XGBoost', label: 'Classifier' },
            { value: 'WAL', label: 'SQLite Mode' },
            { value: 'AES-256', label: 'Security' },
          ].map((stat) => (
            <div key={stat.label} className="p-3.5 rounded-2xl bg-white/[0.03] border border-primary/10 text-center glass-3d-card !p-3.5">
              <p className="text-xs font-serif font-semibold text-primary glow-text-lavender leading-none">{stat.value}</p>
              <p className="text-[9px] font-mono text-textMuted uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Developer Credits */}
        <div className="relative z-10 border-t border-white/5 pt-6 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-primary/60" />
            <span className="text-[9px] font-mono tracking-widest text-textMuted/50 uppercase">2D DEVELOPERS</span>
          </div>
          <div className="space-y-1.5">
            {[
              { name: 'Iban Nadir Mondal', role: 'Creator & Lead Architect' },
              { name: 'Umme Misbah Sikandar', role: 'AI Engineer' },
            ].map((dev) => (
              <div key={dev.name} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary/30 to-[#da77f2]/30 border border-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                  {dev.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-textMain/80 leading-none">{dev.name}</p>
                  <p className="text-[9px] font-mono text-textMuted/60 mt-0.5">{dev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Right Panel — Form --- */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-tr from-[#0c0a14] via-[#110d1e] to-[#160f22]">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-purple p-[1px] shadow-lg">
              <div className="w-full h-full rounded-[10px] bg-[#100e1a] flex items-center justify-center">
                <Shield size={18} className="text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-lg font-serif font-bold text-textMain">Credence AI</p>
          </div>

          {/* Tab Toggle */}
          <div className="flex rounded-2xl bg-white/[0.04] border border-white/8 p-1 mb-8">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  mode === m
                    ? 'bg-gradient-to-r from-primary/20 to-accent-purple/10 text-textMain border border-primary/25 shadow-[0_2px_12px_rgba(177,151,252,0.15)]'
                    : 'text-textMuted hover:text-textMain'
                }`}
              >
                {m === 'login' ? <LogIn size={15} /> : <UserPlus size={15} />}
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form Card (Wrapped in TiltCard) */}
          <TiltCard>
            <form onSubmit={handleSubmit} className="glass-3d-card space-y-5 p-6 md:p-8">
              <div>
                <h2 className="text-2xl font-serif font-medium text-textMain tracking-tight">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-xs text-textMuted mt-1.5 font-light">
                  {mode === 'login'
                    ? 'Sign in to your IDBI Bank risk intelligence dashboard'
                    : 'Join Credence AI — set up your enterprise account'}
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs leading-relaxed">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Rahul"
                      className="w-full bg-white/[0.02] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-textMain placeholder-textMuted/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_18px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Mehta"
                      className="w-full bg-white/[0.02] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-textMain placeholder-textMuted/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_18px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@idbi.com"
                  className="w-full bg-white/[0.02] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-textMain placeholder-textMuted/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_18px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.02] border border-white/8 rounded-xl pl-4 pr-12 py-2.5 text-sm text-textMain placeholder-textMuted/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_18px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">System Role</label>
                  <select
                    value={roleId}
                    onChange={e => setRoleId(e.target.value)}
                    className="w-full bg-[#100e1a] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 focus:shadow-[0_0_18px_rgba(177,151,252,0.12)] transition-all duration-300 font-sans"
                    required
                  >
                    <option value="" disabled>Select role...</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent-purple text-white text-sm font-semibold hover:opacity-95 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition duration-300 flex items-center justify-center gap-1.5 mt-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Authenticate' : 'Register Account'}</span>
                    <ChevronRight size={15} />
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-white/5">
                <p className="text-[10px] text-textMuted/50 leading-relaxed font-mono">
                  {mode === 'login'
                    ? 'Access restricted to authorized IDBI Bank personnel.'
                    : 'By creating an account you agree to our usage policy.'}
                </p>
              </div>
            </form>
          </TiltCard>

          {/* Mobile developer credits */}
          <div className="lg:hidden mt-6 text-center">
            <p className="text-[10px] text-textMuted/40 font-mono">Built by Iban Nadir Mondal & Umme Misbah Sikandar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
