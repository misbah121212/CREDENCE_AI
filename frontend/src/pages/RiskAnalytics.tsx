import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts';
import { AlertTriangle, TrendingUp, CheckCircle, Eye } from 'lucide-react';

// €€€ Mock Data €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const featureImportance = [
  { feature: 'Missed EMIs', value: 0.28 },
  { feature: 'Credit Utilization', value: 0.19 },
  { feature: 'Salary Trend', value: 0.16 },
  { feature: 'Loan-to-Income Ratio', value: 0.12 },
  { feature: 'Employment Stability', value: 0.10 },
  { feature: 'Credit Score', value: 0.08 },
  { feature: 'Withdrawal Patterns', value: 0.07 },
];

const riskDistributionByType = [
  { type: 'Home', low: 420, medium: 180, high: 45 },
  { type: 'Car', low: 310, medium: 95, high: 22 },
  { type: 'Personal', low: 180, medium: 210, high: 88 },
  { type: 'Business', low: 260, medium: 140, high: 55 },
  { type: 'Education', low: 390, medium: 80, high: 18 },
];

const monthlyRiskTrend = [
  { month: 'Aug', highRisk: 280, medRisk: 1200 },
  { month: 'Sep', highRisk: 295, medRisk: 1180 },
  { month: 'Oct', highRisk: 310, medRisk: 1250 },
  { month: 'Nov', highRisk: 305, medRisk: 1220 },
  { month: 'Dec', highRisk: 328, medRisk: 1290 },
  { month: 'Jan', highRisk: 342, medRisk: 1310 },
];

const modelPerformance = [
  { name: 'Accuracy', value: 94.2, color: '#10B981' },
  { name: 'Precision', value: 91.8, color: '#b197fc' },
  { name: 'Recall', value: 89.5, color: '#F59E0B' },
  { name: 'F1 Score', value: 90.6, color: '#8B5CF6' },
];

const alerts = [
  { id: 'CUST-8492', name: 'John Doe', message: 'Risk score jumped 85 (+55 in 6 months)', severity: 'high', time: '2h ago', read: false },
  { id: 'CUST-2891', name: 'Rahul Mehta', message: 'Missed 3rd consecutive EMI', severity: 'high', time: '5h ago', read: false },
  { id: 'CUST-6602', name: 'Fatima Sheikh', message: 'Credit utilization exceeded 80%', severity: 'medium', time: '8h ago', read: false },
  { id: 'CUST-1042', name: 'Priya Sharma', message: 'Large withdrawal: ₹1.8L detected', severity: 'medium', time: '1d ago', read: true },
  { id: 'CUST-0334', name: 'Anita Desai', message: 'Credit score dropped 62 points', severity: 'medium', time: '2d ago', read: true },
];

// €€€ Custom Tooltip €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface border border-white/10 rounded-lg px-4 py-3 text-sm shadow-xl">
        <p className="font-semibold text-textMain mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="flex gap-2">
            <span>{p.name}:</span><strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// €€€ Main Page €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const RiskAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain tracking-tight">Risk Analytics</h1>
          <p className="text-sm text-textMuted mt-1">Portfolio risk intelligence · Last updated: Today, 6:30 PM</p>
        </div>
        <div className="flex gap-2">
          {['overview', 'model performance', 'alert center'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${activeTab === t ? 'bg-primary text-white' : 'bg-surfaceHighlight text-textMuted hover:text-textMain'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* €€ Overview Tab €€ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature Importance */}
            <div className="glass-panel p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-5">
                Global Feature Importance (Top Default Drivers)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportance} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 120 }}>
                    <XAxis type="number" tickFormatter={v => `${(v * 100).toFixed(0)}%`} stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: 8 }} formatter={(v: any) => `${(v * 100).toFixed(1)}%`} />
                    <Bar dataKey="value" name="Importance" radius={[0, 4, 4, 0]} fill="#b197fc" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk by Loan Type */}
            <div className="glass-panel p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-5">
                Risk Distribution by Loan Type
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskDistributionByType} margin={{ top: 0, right: 20, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                    <XAxis dataKey="type" stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
                    <Bar dataKey="low" name="Low" stackId="a" fill="#10B981" />
                    <Bar dataKey="medium" name="Medium" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="high" name="High" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly Risk Trend */}
          <div className="glass-panel p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-5">
              Portfolio Risk Trend  6 Month Rolling View
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRiskTrend} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                  <defs>
                    <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                  <XAxis dataKey="month" stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ color: '#9CA3AF', fontSize: 12, paddingTop: 12 }} />
                  <Area type="monotone" dataKey="medRisk" name="Medium Risk" stroke="#F59E0B" strokeWidth={2} fill="url(#medGrad)" />
                  <Area type="monotone" dataKey="highRisk" name="High Risk" stroke="#EF4444" strokeWidth={2.5} fill="url(#highGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* €€ Model Performance Tab €€ */}
      {activeTab === 'model performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modelPerformance.map(metric => (
            <div key={metric.name} className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-textMuted uppercase tracking-widest">{metric.name}</h3>
                <TrendingUp size={18} className="text-success" />
              </div>
              <p className="text-5xl font-black" style={{ color: metric.color }}>{metric.value}%</p>
              <div className="mt-4 h-2 bg-surfaceHighlight rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${metric.value}%`, backgroundColor: metric.color }} />
              </div>
              <p className="text-xs text-textMuted mt-2">Evaluated on last 30-day holdout dataset</p>
            </div>
          ))}
          <div className="glass-card md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-4">Model Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Algorithm', value: 'XGBoost + CatBoost Ensemble' },
                { label: 'Training Samples', value: '48,200 records' },
                { label: 'Features Used', value: '42 engineered features' },
                { label: 'Last Retrained', value: 'July 1, 2025' },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-lg bg-surface border border-white/5 text-center">
                  <p className="text-xs text-textMuted mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-textMain">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* €€ Alert Center Tab €€ */}
      {activeTab === 'alert center' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-textMuted">{alerts.filter(a => !a.read).length} unread alerts</p>
            <button className="text-xs text-primary hover:underline flex items-center gap-1"><CheckCircle size={13} /> Mark all as read</button>
          </div>
          {alerts.map(alert => (
            <div key={alert.id} className={`glass-panel p-5 flex items-start gap-4 transition ${!alert.read ? 'border-l-4 border-l-danger' : 'opacity-70'}`}>
              <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${alert.severity === 'high' ? 'bg-danger/15 text-danger' : 'bg-warning/15 text-warning'}`}>
                <AlertTriangle size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-textMain">{alert.name}
                      <span className="text-textMuted font-normal text-xs ml-2">{alert.id}</span>
                    </p>
                    <p className="text-sm text-textMuted mt-1">{alert.message}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-textMuted">{alert.time}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${alert.severity === 'high' ? 'bg-danger/15 text-danger border-danger/20' : 'bg-warning/15 text-warning border-warning/20'}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <button className="text-xs text-primary hover:underline flex items-center gap-1"><Eye size={12} /> View Profile</button>
                  <button className="text-xs text-success hover:underline flex items-center gap-1"><CheckCircle size={12} /> Mark Resolved</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskAnalytics;

