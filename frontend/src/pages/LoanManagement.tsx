import React, { useState } from 'react';
import { Search, Filter, Home, Car, Briefcase, GraduationCap, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// €€€ Mock Data €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const loans = [
  { id: 'LN-0012', customer: 'John Doe', custId: 'CUST-8492', type: 'Home', amount: '₹48,00,000', emi: '₹24,500', rate: '8.75%', tenure: '240 mo', balance: '₹26,40,000', status: 'Active', missed: 2 },
  { id: 'LN-0034', customer: 'Rahul Mehta', custId: 'CUST-2891', type: 'Personal', amount: '₹5,00,000', emi: '₹11,200', rate: '13.5%', tenure: '60 mo', balance: '₹3,20,000', status: 'Active', missed: 3 },
  { id: 'LN-0051', customer: 'Fatima Sheikh', custId: 'CUST-6602', type: 'Business', amount: '₹25,00,000', emi: '₹52,000', rate: '11.25%', tenure: '84 mo', balance: '₹18,40,000', status: 'Active', missed: 0 },
  { id: 'LN-0078', customer: 'Sunita Rao', custId: 'CUST-3310', type: 'Education', amount: '₹8,00,000', emi: '₹9,800', rate: '7.5%', tenure: '120 mo', balance: '₹5,60,000', status: 'Active', missed: 1 },
  { id: 'LN-0093', customer: 'Vijay Patel', custId: 'CUST-5512', type: 'Car', amount: '₹12,00,000', emi: '₹26,000', rate: '9.25%', tenure: '60 mo', balance: '₹4,10,000', status: 'Active', missed: 0 },
  { id: 'LN-0102', customer: 'Priya Sharma', custId: 'CUST-1042', type: 'Home', amount: '₹35,00,000', emi: '₹31,200', rate: '8.9%', tenure: '180 mo', balance: '₹28,90,000', status: 'Defaulted', missed: 6 },
  { id: 'LN-0115', customer: 'Amit Kumar', custId: 'CUST-7721', type: 'Home', amount: '₹22,00,000', emi: '₹18,500', rate: '8.5%', tenure: '240 mo', balance: '₹19,80,000', status: 'Active', missed: 0 },
  { id: 'LN-0131', customer: 'Anita Desai', custId: 'CUST-0334', type: 'Car', amount: '₹9,00,000', emi: '₹19,400', rate: '9.0%', tenure: '60 mo', balance: '₹2,30,000', status: 'Closed', missed: 0 },
];

const loanTypeIcons: Record<string, any> = {
  Home: Home, Car: Car, Personal: User, Business: Briefcase, Education: GraduationCap,
};
const loanTypeColors: Record<string, string> = {
  Home: 'bg-blue-500/10 text-blue-400', Car: 'bg-emerald-500/10 text-emerald-400',
  Personal: 'bg-violet-500/10 text-violet-400', Business: 'bg-orange-500/10 text-orange-400',
  Education: 'bg-cyan-500/10 text-cyan-400',
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Active: 'bg-success/15 text-success border-success/20',
    Defaulted: 'bg-danger/15 text-danger border-danger/20',
    Closed: 'bg-textMuted/15 text-textMuted border-white/10',
  };
  return <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${map[status]}`}>{status}</span>;
};

// €€€ Main Page €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const LoanManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = loans.filter(l => {
    const matchSearch = l.customer.toLowerCase().includes(search.toLowerCase()) || l.id.includes(search);
    const matchType = typeFilter === 'All' || l.type === typeFilter;
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalActive = loans.filter(l => l.status === 'Active').length;
  const totalDefaulted = loans.filter(l => l.status === 'Defaulted').length;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textMain tracking-tight">Loan Management</h1>
          <p className="text-sm text-textMuted mt-1">{loans.length} total loans · {totalActive} active · {totalDefaulted} defaulted</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['Home', 'Car', 'Personal', 'Business', 'Education'].map(type => {
          const Icon = loanTypeIcons[type];
          const count = loans.filter(l => l.type === type).length;
          return (
            <button key={type} onClick={() => setTypeFilter(t => t === type ? 'All' : type)}
              className={`glass-card flex items-center gap-3 transition hover:border-white/20 border ${typeFilter === type ? 'border-primary/50' : 'border-transparent'}`}>
              <div className={`p-2 rounded-lg ${loanTypeColors[type]}`}><Icon size={18} /></div>
              <div className="text-left">
                <p className="text-xs text-textMuted">{type}</p>
                <p className="text-lg font-bold text-textMain">{count}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input type="text" placeholder="Search by customer or loan ID..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-surfaceHighlight border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-textMain placeholder-textMuted focus:outline-none focus:border-primary/50 transition" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-textMuted" />
          {['All', 'Active', 'Defaulted', 'Closed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${statusFilter === s ? 'bg-primary text-white' : 'bg-surfaceHighlight text-textMuted hover:text-textMain'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-surfaceHighlight/40">
              <tr className="text-xs uppercase tracking-wider text-textMuted">
                <th className="text-left px-5 py-4 font-medium">Loan ID</th>
                <th className="text-left px-5 py-4 font-medium">Customer</th>
                <th className="text-left px-5 py-4 font-medium">Type</th>
                <th className="text-left px-5 py-4 font-medium">Principal</th>
                <th className="text-left px-5 py-4 font-medium">EMI / Rate</th>
                <th className="text-left px-5 py-4 font-medium">Balance</th>
                <th className="text-left px-5 py-4 font-medium">Missed</th>
                <th className="text-left px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(loan => {
                const Icon = loanTypeIcons[loan.type];
                return (
                  <tr key={loan.id} className="hover:bg-surfaceHighlight/40 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-textMuted">{loan.id}</td>
                    <td className="px-5 py-4">
                      <Link to={`/app/customers/${loan.custId}`} className="group">
                        <p className="font-semibold text-textMain group-hover:text-primary transition">{loan.customer}</p>
                        <p className="text-xs text-textMuted">{loan.custId}</p>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-2 px-2.5 py-1 rounded w-fit text-xs font-semibold ${loanTypeColors[loan.type]}`}>
                        <Icon size={12} /> {loan.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-textMain">{loan.amount}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-textMain">{loan.emi}</p>
                      <p className="text-xs text-textMuted">{loan.rate} · {loan.tenure}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-textMain">{loan.balance}</td>
                    <td className="px-5 py-4">
                      <span className={`font-bold text-sm ${loan.missed > 2 ? 'text-danger' : loan.missed > 0 ? 'text-warning' : 'text-success'}`}>
                        {loan.missed === 0 ? '' : `${loan.missed} missed`}
                      </span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={loan.status} /></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-textMuted">No loans match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-white/10 flex justify-between text-xs text-textMuted">
          <span>Showing {filtered.length} of {loans.length} loans</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded bg-surfaceHighlight hover:bg-white/10 transition">Prev</button>
            <button className="px-3 py-1 rounded bg-primary text-white">1</button>
            <button className="px-3 py-1 rounded bg-surfaceHighlight hover:bg-white/10 transition">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanManagement;

