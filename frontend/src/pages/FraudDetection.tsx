import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Fingerprint, Check, RefreshCw } from 'lucide-react';

interface FraudAlert {
  id: string;
  borrower: string;
  custId: string;
  flagType: string;
  confidence: number;
  status: 'Under Audit' | 'Flagged' | 'Cleared';
}

const FraudDetection: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([
    { id: 'FR-091', borrower: 'Vijay Patel', custId: 'CUST-5512', flagType: 'Duplicate PAN application detected in bureau logs', confidence: 94, status: 'Flagged' },
    { id: 'FR-084', borrower: 'John Doe', custId: 'CUST-8492', flagType: 'Salary statement mismatch vs payroll credit ledger', confidence: 88, status: 'Under Audit' },
    { id: 'FR-072', borrower: 'Fatima Sheikh', custId: 'CUST-6602', flagType: 'Unusual multiple login IP addresses flagged during session', confidence: 81, status: 'Cleared' },
    { id: 'FR-061', borrower: 'Rahul Mehta', custId: 'CUST-2891', flagType: 'Employer registration registry matching failure', confidence: 79, status: 'Under Audit' },
  ]);

  const updateStatus = (id: string, newStatus: 'Flagged' | 'Cleared') => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6 font-sans">
      {/* Heading */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold">Fraud Sentinel v1.1</span>
        <h1 className="text-2xl font-serif font-bold text-textMain tracking-tight mt-1">AI Fraud Audit Center</h1>
        <p className="text-xs text-textMuted mt-1">Real-time matching algorithms auditing identity, income statement proof, and credit bureau histories.</p>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-3d-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-textMuted">Flagged Income Statements</p>
            <h3 className="text-2xl font-bold text-textMain mt-1">2 Accounts</h3>
          </div>
        </div>

        <div className="glass-3d-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Fingerprint size={20} />
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-textMuted">Identity Match Success</p>
            <h3 className="text-2xl font-bold text-textMain mt-1">98.2% Verified</h3>
          </div>
        </div>

        <div className="glass-3d-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-textMuted">Audit Clearing Speed</p>
            <h3 className="text-2xl font-bold text-textMain mt-1">&lt; 15 Minutes</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-textMuted">Suspicious Anomalies Audit</h3>
          <button className="flex items-center gap-1 text-[10px] text-textMuted hover:text-textMain transition">
            <RefreshCw size={10} /> Refresh Logs
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/8 bg-white/[0.01]">
              <tr className="text-xs uppercase tracking-wider text-textMuted font-mono">
                <th className="text-left px-6 py-4 font-medium">Alert ID</th>
                <th className="text-left px-6 py-4 font-medium">Borrower</th>
                <th className="text-left px-6 py-4 font-medium">Flag Type / Anomaly details</th>
                <th className="text-left px-6 py-4 font-medium">Confidence</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {alerts.map(a => (
                <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-textMain">{a.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-textMain">{a.borrower}</p>
                    <p className="text-xs text-textMuted font-mono">{a.custId}</p>
                  </td>
                  <td className="px-6 py-4 text-textMuted text-xs">{a.flagType}</td>
                  <td className="px-6 py-4 font-mono font-bold text-textMain">{a.confidence}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      a.status === 'Flagged' ? 'bg-danger/15 text-danger border border-danger/10' :
                      a.status === 'Cleared' ? 'bg-success/15 text-success border border-success/10' :
                      'bg-warning/15 text-warning border border-warning/10'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(a.id, 'Cleared')}
                        className="p-1 rounded bg-success/10 text-success hover:bg-success/20 transition"
                        title="Mark Cleared"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, 'Flagged')}
                        className="p-1 rounded bg-danger/10 text-danger hover:bg-danger/20 transition"
                        title="Escalate Flag"
                      >
                        <ShieldAlert size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FraudDetection;
