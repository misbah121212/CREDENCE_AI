import React, { useState } from 'react';
import {
  User, Lock, Bell, Shield, Building2, Palette,
  Save, Eye, EyeOff, CheckCircle, ToggleLeft, ToggleRight, ChevronRight
} from 'lucide-react';

// €€€ Toggle Switch €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button onClick={onChange} className="flex-shrink-0">
    {enabled
      ? <ToggleRight size={28} className="text-primary" />
      : <ToggleLeft size={28} className="text-textMuted" />}
  </button>
);

// €€€ Section Header €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const SectionHeader = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-6">
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon size={20} className="text-primary" />
    </div>
    <div>
      <h2 className="text-base font-bold text-textMain">{title}</h2>
      <p className="text-xs text-textMuted mt-0.5">{desc}</p>
    </div>
  </div>
);

// €€€ Main Page €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const Settings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile
  const [fullName, setFullName] = useState('Bank Manager');
  const [email, setEmail] = useState('manager@idbi.com');
  const [branch, setBranch] = useState('IDBI Bank  Mumbai HQ');
  const [phone, setPhone] = useState('+91 98765 43210');

  // Password
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Notifications
  const [notifHighRisk, setNotifHighRisk] = useState(true);
  const [notifMissedEmi, setNotifMissedEmi] = useState(true);
  const [notifWeeklyReport, setNotifWeeklyReport] = useState(false);
  const [notifSystemAlerts, setNotifSystemAlerts] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);

  // AI Preferences
  const [aiThreshold, setAiThreshold] = useState(70);
  const [aiAutoRecalc, setAiAutoRecalc] = useState(true);
  const [aiShap, setAiShap] = useState(true);

  // Theme
  const [theme, setTheme] = useState('dark');
  const [compactMode, setCompactMode] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai', label: 'AI Preferences', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'bank', label: 'Bank Info', icon: Building2 },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textMain tracking-tight">Settings</h1>
          <p className="text-sm text-textMuted mt-1">Manage your account, preferences, and platform configuration</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition"
        >
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-success/15 border border-success/20 text-success text-sm font-semibold animate-pulse">
          <CheckCircle size={16} /> Settings saved successfully.
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="glass-panel p-2 h-fit min-w-[200px] space-y-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === t.id
                  ? 'bg-primary/15 text-primary'
                  : 'text-textMuted hover:text-textMain hover:bg-surfaceHighlight/40'
              }`}
            >
              <t.icon size={16} />
              {t.label}
              {activeTab === t.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="glass-panel p-6 flex-1">

          {/* €€ PROFILE €€ */}
          {activeTab === 'profile' && (
            <div>
              <SectionHeader icon={User} title="Profile Information" desc="Update your personal and contact details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Full Name</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Role</label>
                  <input value="Bank Manager" disabled
                    className="w-full bg-surfaceHighlight/50 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-textMuted cursor-not-allowed" />
                </div>
              </div>

              {/* Avatar */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-3">Profile Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">BM</div>
                  <div>
                    <p className="text-sm text-textMain font-medium">Bank Manager</p>
                    <p className="text-xs text-textMuted mt-0.5">Avatar is auto-generated from your initials</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* €€ SECURITY €€ */}
          {activeTab === 'security' && (
            <div>
              <SectionHeader icon={Lock} title="Security & Password" desc="Keep your account secure with a strong password" />
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Current Password</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder=""
                      className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2.5 pr-10 text-sm text-textMain focus:outline-none focus:border-primary/50 transition" />
                    <button onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">New Password</label>
                  <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Minimum 8 characters"
                    className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Confirm New Password</label>
                  <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Re-enter new password"
                    className={`w-full bg-surfaceHighlight border rounded-lg px-3 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition ${
                      confirmPwd && newPwd !== confirmPwd ? 'border-danger/50' : 'border-white/10'
                    }`} />
                  {confirmPwd && newPwd !== confirmPwd && (
                    <p className="text-xs text-danger mt-1">Passwords do not match</p>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={!currentPwd || !newPwd || newPwd !== confirmPwd}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 transition"
                >
                  Update Password
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-textMain mb-4">Session & Access</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Last login', value: 'Today at 8:43 PM · Chrome, Windows' },
                    { label: 'Session expires', value: 'In 23 hours 17 minutes' },
                    { label: 'IP Address', value: '192.168.1.1 (Local)' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-white/5">
                      <span className="text-sm text-textMuted">{item.label}</span>
                      <span className="text-sm text-textMain font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* €€ NOTIFICATIONS €€ */}
          {activeTab === 'notifications' && (
            <div>
              <SectionHeader icon={Bell} title="Notification Preferences" desc="Control which alerts and updates you receive" />
              <div className="space-y-4">
                {[
                  { label: 'High Risk Alerts', desc: 'Notify when a customer enters the High risk category', val: notifHighRisk, set: () => setNotifHighRisk(v => !v) },
                  { label: 'Missed EMI Alerts', desc: 'Alert when a borrower misses an EMI payment', val: notifMissedEmi, set: () => setNotifMissedEmi(v => !v) },
                  { label: 'Weekly Summary Report', desc: 'Receive a weekly email summary of portfolio health', val: notifWeeklyReport, set: () => setNotifWeeklyReport(v => !v) },
                  { label: 'System Alerts', desc: 'Platform updates, maintenance windows, and model retrains', val: notifSystemAlerts, set: () => setNotifSystemAlerts(v => !v) },
                  { label: 'Email Notifications', desc: 'Receive all alerts via email in addition to in-app', val: notifEmail, set: () => setNotifEmail(v => !v) },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-surfaceHighlight/30 border border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-textMain">{item.label}</p>
                      <p className="text-xs text-textMuted mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle enabled={item.val} onChange={item.set} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* €€ AI PREFERENCES €€ */}
          {activeTab === 'ai' && (
            <div>
              <SectionHeader icon={Shield} title="AI Engine Preferences" desc="Configure risk model behavior and thresholds" />
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">
                    High-Risk Score Threshold: <span className="text-primary">{aiThreshold}</span>
                  </label>
                  <input type="range" min={50} max={90} step={5} value={aiThreshold}
                    onChange={e => setAiThreshold(Number(e.target.value))}
                    className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-textMuted mt-1">
                    <span>50 (Sensitive)</span><span>90 (Conservative)</span>
                  </div>
                  <p className="text-xs text-textMuted mt-2">Customers with risk scores above this threshold will be flagged as High Risk.</p>
                </div>

                {[
                  { label: 'Auto-Recalculate Scores', desc: 'Automatically recalculate risk scores when new EMI data is ingested', val: aiAutoRecalc, set: () => setAiAutoRecalc(v => !v) },
                  { label: 'SHAP Explanations', desc: 'Generate SHAP feature importance explanations for every prediction', val: aiShap, set: () => setAiShap(v => !v) },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-surfaceHighlight/30 border border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-textMain">{item.label}</p>
                      <p className="text-xs text-textMuted mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle enabled={item.val} onChange={item.set} />
                  </div>
                ))}

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Current Model</p>
                  <p className="text-sm text-textMain font-semibold">XGBoost v1.0  Credence Risk Engine</p>
                  <p className="text-xs text-textMuted mt-1">Trained on 50,000+ loan samples · AUC: 0.91 · Last retrained: July 2025</p>
                </div>
              </div>
            </div>
          )}

          {/* €€ APPEARANCE €€ */}
          {activeTab === 'appearance' && (
            <div>
              <SectionHeader icon={Palette} title="Appearance" desc="Customize the platform's look and feel" />
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-3">Theme</label>
                  <div className="flex gap-3">
                    {[
                      { id: 'dark', label: 'Dark', emoji: 'ðŸŒ‘' },
                      { id: 'light', label: 'Light', emoji: '€ï¸' },
                      { id: 'system', label: 'System', emoji: 'ðŸ’»' },
                    ].map(t => (
                      <button key={t.id} onClick={() => setTheme(t.id)}
                        className={`flex-1 py-4 rounded-xl border text-center text-sm font-semibold transition ${
                          theme === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 bg-surfaceHighlight text-textMuted hover:border-white/20'
                        }`}>
                        <div className="text-2xl mb-1">{t.emoji}</div>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-surfaceHighlight/30 border border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-textMain">Compact Mode</p>
                    <p className="text-xs text-textMuted mt-0.5">Reduce spacing and padding for denser information display</p>
                  </div>
                  <Toggle enabled={compactMode} onChange={() => setCompactMode(v => !v)} />
                </div>
              </div>
            </div>
          )}

          {/* €€ BANK INFO €€ */}
          {activeTab === 'bank' && (
            <div>
              <SectionHeader icon={Building2} title="Bank & Branch Information" desc="Organization details linked to your account" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Bank Name</label>
                  <input value="IDBI Bank Ltd." disabled
                    className="w-full bg-surfaceHighlight/50 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-textMuted cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Branch</label>
                  <input value={branch} onChange={e => setBranch(e.target.value)}
                    className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">IFSC Code</label>
                  <input value="IBKL0000001" disabled
                    className="w-full bg-surfaceHighlight/50 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-textMuted cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Region</label>
                  <input value="West India  Maharashtra" disabled
                    className="w-full bg-surfaceHighlight/50 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-textMuted cursor-not-allowed" />
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-surfaceHighlight/30 border border-white/5">
                <p className="text-xs text-textMuted">Contact your system administrator to update bank-level details.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;

