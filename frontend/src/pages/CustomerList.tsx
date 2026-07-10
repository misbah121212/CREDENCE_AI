import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Plus, Filter, Loader2, AlertCircle, RefreshCw, X, Check } from 'lucide-react';
import { customerApi, aiApi, type Customer, type Prediction } from '../lib/api';

// --- Risk Badge ---
const RiskBadge = ({ category }: { category?: string }) => {
  if (!category) return <span className="text-textMuted text-xs">N/A</span>;
  const map: Record<string, string> = {
    High: 'bg-danger/15 text-danger border border-danger/20',
    Medium: 'bg-warning/15 text-warning border border-warning/20',
    Low: 'bg-success/15 text-success border border-success/20',
  };
  return <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${map[category] ?? 'bg-surfaceHighlight text-textMuted'}`}>{category}</span>;
};

// --- Risk Score Bar ---
const ScoreBar = ({ score }: { score?: number }) => {
  if (score == null) return <span className="text-textMuted text-xs">-</span>;
  const color = score >= 70 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#10B981';
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 h-1.5 rounded-full bg-surfaceHighlight overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-bold text-textMain">{score}</span>
    </div>
  );
};

interface CustomerRow {
  customer: Customer;
  prediction?: Prediction;
}

// Simple global SWR cache for CustomerList to load pages instantly
let customerCache: {
  [key: string]: {
    rows: CustomerRow[];
    total: number;
    timestamp: number;
  }
} = {};

const CustomerList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formOccupation, setFormOccupation] = useState('');
  const [formEmployer, setFormEmployer] = useState('');
  const [formSalary, setFormSalary] = useState('');
  const [formCreditScore, setFormCreditScore] = useState('700');
  const [formDependents, setFormDependents] = useState('0');
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Sync search state when URL param changes
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
    setPage(1);
  }, [searchParams]);

  const fetchData = useCallback(async (searchQuery?: string, pageNum = 1) => {
    const cacheKey = `${pageNum}-${searchQuery || ''}`;
    const cached = customerCache[cacheKey];
    
    // SWR Cache Hit: Instantly load cached rows and avoid full screen spinner!
    if (cached && Date.now() - cached.timestamp < 60000) { // 60s TTL
      setRows(cached.rows);
      setTotal(cached.total);
      setLoading(false);
    } else {
      setLoading(true);
    }
    
    setError('');
    try {
      const skipNum = (pageNum - 1) * limit;
      const { customers, total: t } = await customerApi.list(skipNum, limit, searchQuery);
      setTotal(t);

      // Fetch predictions for each customer in parallel
      const withPredictions: CustomerRow[] = await Promise.all(
        customers.map(async (customer) => {
          try {
            const preds = await aiApi.getCustomerPredictions(customer.id);
            return { customer, prediction: preds[0] };
          } catch {
            return { customer };
          }
        })
      );
      
      // Update Cache
      customerCache[cacheKey] = {
        rows: withPredictions,
        total: t,
        timestamp: Date.now()
      };

      setRows(withPredictions);
    } catch (err: any) {
      if (!cached) {
        setError(err.message || 'Failed to load customers.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on search or page change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(search, page);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, page, fetchData]);

  const filtered = rows.filter(({ prediction }) => {
    const category = prediction?.risk_category;
    const matchFilter = filter === 'All' || category === filter;
    return matchFilter;
  });

  const formatSalary = (val?: number) =>
    val ? `₹${val.toLocaleString('en-IN')}` : '';

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formFirstName || !formLastName) {
      setFormError('Please enter both First Name and Last Name.');
      return;
    }

    setFormSaving(true);
    try {
      // Auto-generate a unique CUST-XXXXXX string
      const randomID = 'CUST-' + Math.floor(100000 + Math.random() * 900000);
      
      const payload = {
        customer_id_string: randomID,
        first_name: formFirstName,
        last_name: formLastName,
        occupation: formOccupation || 'Self-Employed',
        employer: formEmployer || 'N/A',
        monthly_salary: formSalary ? parseFloat(formSalary) : 0,
        credit_score: parseInt(formCreditScore) || 700,
        family_dependents: parseInt(formDependents) || 0,
      };

      await customerApi.create(payload);
      setFormSuccess(true);
      
      // Reload customer list
      await fetchData();

      setTimeout(() => {
        setFormSuccess(false);
        setModalOpen(false);
        // Reset fields
        setFormFirstName('');
        setFormLastName('');
        setFormOccupation('');
        setFormEmployer('');
        setFormSalary('');
        setFormCreditScore('700');
        setFormDependents('0');
      }, 1000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create customer record.');
    } finally {
      setFormSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-textMain tracking-tight">Customers</h1>
          <p className="text-sm text-textMuted mt-1">{total} total borrowers in portfolio</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(search)}
            className="flex items-center justify-center p-2 rounded-xl bg-white/[0.04] border border-white/8 text-textMuted hover:text-textMain transition-all duration-300"
            title="Refresh list"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent-purple text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20"
          >
            <Plus size={16} /> Add Customer
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-panel flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/8 rounded-xl pl-10 pr-4 py-2 text-sm text-textMain placeholder-textMuted/60 focus:outline-none focus:border-primary/50 transition font-sans"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-textMuted" />
          {['All', 'High', 'Medium', 'Low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition font-sans ${
                filter === f ? 'bg-gradient-to-r from-primary to-accent-purple text-white shadow-md' : 'bg-white/[0.04] text-textMuted hover:text-textMain border border-white/8'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="glass-panel p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-textMuted text-sm">Loading customers from database</p>
        </div>
      )}

      {!loading && error && (
        <div className="glass-panel p-8 flex items-center gap-4 text-danger">
          <AlertCircle size={20} />
          <div>
            <p className="font-semibold">Failed to load customers</p>
            <p className="text-sm text-textMuted mt-1">{error}</p>
          </div>
          <button onClick={() => fetchData(search)} className="ml-auto px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-xs font-semibold hover:bg-danger/20 transition">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="glass-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/8 bg-white/[0.01]">
                <tr className="text-xs uppercase tracking-wider text-textMuted font-mono">
                  <th className="text-left px-6 py-4 font-medium">Customer</th>
                  <th className="text-left px-6 py-4 font-medium">Occupation</th>
                  <th className="text-left px-6 py-4 font-medium">Monthly Salary</th>
                  <th className="text-left px-6 py-4 font-medium">Credit Score</th>
                  <th className="text-left px-6 py-4 font-medium">Risk Score</th>
                  <th className="text-left px-6 py-4 font-medium">Category</th>
                  <th className="text-left px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(({ customer, prediction }) => {
                  const name = `${customer.first_name} ${customer.last_name}`;
                  const initials = [customer.first_name[0], customer.last_name[0]].join('');
                  const cs = customer.credit_score;
                  return (
                    <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-textMain">{name}</p>
                            <p className="text-xs text-textMuted font-mono">{customer.customer_id_string}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-textMuted">{customer.occupation ?? ''}</td>
                      <td className="px-6 py-4 font-medium text-textMain">{formatSalary(customer.monthly_salary)}</td>
                      <td className="px-6 py-4">
                        {cs != null ? (
                          <span className={`font-mono font-semibold ${cs >= 750 ? 'text-success' : cs >= 650 ? 'text-warning' : 'text-danger'}`}>
                            {cs}
                          </span>
                        ) : ''}
                      </td>
                      <td className="px-6 py-4"><ScoreBar score={prediction?.risk_score} /></td>
                      <td className="px-6 py-4"><RiskBadge category={prediction?.risk_category} /></td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/app/customers/${customer.id}`}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-textMuted">
                      {rows.length === 0 ? 'No customers found in the database.' : 'No customers match your search.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between text-xs text-textMuted font-mono">
            <span>Showing {total === 0 ? 0 : ((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total} customers</span>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition border border-white/8 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-textMain">Page {page} of {Math.ceil(total / limit) || 1}</span>
              <button
                onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
                disabled={page >= Math.ceil(total / limit) || loading}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition border border-white/8 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD CUSTOMER MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in-up">
          <div className="glass-3d-card w-full max-w-xl relative mx-4 p-6 md:p-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-textMuted hover:text-textMain hover:bg-white/5 transition"
            >
              <X size={16} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-serif font-semibold text-textMain">Add New Customer</h3>
              <p className="text-xs text-textMuted mt-1">Insert a new borrower record into the Credence system.</p>
            </div>

            {formError && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs mb-5">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCustomer} className="space-y-4 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">First Name</label>
                  <input
                    required
                    value={formFirstName}
                    onChange={e => setFormFirstName(e.target.value)}
                    placeholder="Umme"
                    className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Last Name</label>
                  <input
                    required
                    value={formLastName}
                    onChange={e => setFormLastName(e.target.value)}
                    placeholder="Sikandar"
                    className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Occupation</label>
                  <input
                    value={formOccupation}
                    onChange={e => setFormOccupation(e.target.value)}
                    placeholder="Software Engineer"
                    className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Employer</label>
                  <input
                    value={formEmployer}
                    onChange={e => setFormEmployer(e.target.value)}
                    placeholder="Google"
                    className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Salary (INR/mo)</label>
                  <input
                    type="number"
                    value={formSalary}
                    onChange={e => setFormSalary(e.target.value)}
                    placeholder="120000"
                    className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition font-sans"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Credit Score</label>
                  <input
                    type="number"
                    min="300"
                    max="900"
                    value={formCreditScore}
                    onChange={e => setFormCreditScore(e.target.value)}
                    placeholder="750"
                    className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition font-sans"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-mono tracking-widest text-textMuted uppercase block mb-1.5">Dependents</label>
                  <input
                    type="number"
                    min="0"
                    value={formDependents}
                    onChange={e => setFormDependents(e.target.value)}
                    placeholder="2"
                    className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 transition font-sans"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-textMuted bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving || formSuccess}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-accent-purple text-white shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2 font-sans"
                >
                  {formSaving ? (
                    <><Loader2 size={15} className="animate-spin" /> Saving...</>
                  ) : formSuccess ? (
                    <><Check size={15} /> Added Successfully!</>
                  ) : (
                    'Add Customer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
