import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Download, Briefcase, CreditCard,
  AlertTriangle, ShieldAlert, TrendingDown, Loader2, RefreshCw, Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid
} from 'recharts';
import {
  customerApi, aiApi, loanApi,
  type Customer, type Prediction, type Loan, type EMIHistory
} from '../lib/api';

// €€€ Sub Components €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const InfoRow = ({ label, value, valueClass = '' }: { label: string; value: React.ReactNode; valueClass?: string }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
    <span className="text-sm text-textMuted">{label}</span>
    <span className={`text-sm font-semibold text-textMain ${valueClass}`}>{value}</span>
  </div>
);

const EMIStatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Paid: 'bg-success/15 text-success',
    Missed: 'bg-danger/15 text-danger',
    Late: 'bg-warning/15 text-warning',
    Pending: 'bg-surfaceHighlight text-textMuted',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${map[status] ?? 'bg-surfaceHighlight text-textMuted'}`}>{status}</span>;
};

const RiskColor = (score: number) => score >= 70 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#10B981';

const formatCurrency = (val?: number | null) =>
  val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '';

// €€€ Main Page €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const CustomerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = ['overview', 'financials', 'ai-intelligence', 'documents'];

  // Data state
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [emiHistories, setEmiHistories] = useState<Record<string, EMIHistory[]>>({});
  const [latestPrediction, setLatestPrediction] = useState<Prediction | null>(null);
  const [allPredictions, setAllPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const [cust, custLoans, preds] = await Promise.all([
        customerApi.get(id),
        customerApi.getLoans(id),
        aiApi.getCustomerPredictions(id),
      ]);
      setCustomer(cust);
      setLoans(custLoans);
      setAllPredictions(preds);
      setLatestPrediction(preds[0] ?? null);

      // Fetch EMI history for each loan
      const emiMap: Record<string, EMIHistory[]> = {};
      await Promise.all(
        custLoans.map(async (loan) => {
          try {
            emiMap[loan.id] = await loanApi.getEmiHistory(loan.id);
          } catch {
            emiMap[loan.id] = [];
          }
        })
      );
      setEmiHistories(emiMap);
    } catch (err: any) {
      setError(err.message || 'Failed to load customer data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const runPrediction = async () => {
    if (!id) return;
    setPredicting(true);
    try {
      await aiApi.runPrediction(id);
      // Refresh prediction data
      const preds = await aiApi.getCustomerPredictions(id);
      setAllPredictions(preds);
      setLatestPrediction(preds[0] ?? null);
    } catch (err: any) {
      alert('Prediction failed: ' + (err.message || 'Unknown error'));
    } finally {
      setPredicting(false);
    }
  };

  // Build risk timeline from predictions history
  const riskTimeline = allPredictions.slice(0, 6).reverse().map((p, i) => ({
    month: p.prediction_date ? new Date(p.prediction_date).toLocaleDateString('en', { month: 'short' }) : `T-${i}`,
    score: p.risk_score,
  }));

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full gap-4 min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="text-textMuted text-sm">Loading customer profile</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-8 flex flex-col items-center gap-4 min-h-[60vh] justify-center">
        <AlertTriangle size={32} className="text-danger" />
        <p className="text-danger font-semibold">{error || 'Customer not found'}</p>
        <Link to="/app/customers" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"> Back to Customers</Link>
      </div>
    );
  }

  const fullName = `${customer.first_name} ${customer.last_name}`;
  const initials = `${customer.first_name[0]}${customer.last_name[0]}`;
  const cs = customer.credit_score;
  const risk = latestPrediction;
  const riskColor = risk ? RiskColor(risk.risk_score) : '#6B7280';
  const categoryColor = risk?.risk_category === 'High' ? 'text-danger' : risk?.risk_category === 'Medium' ? 'text-warning' : 'text-success';
  const shapFeatures = risk?.shap_explanations?.features ?? [];

  // Priority accent map for recommendations
  const priorityMap: Record<string, { icon: React.ElementType; accent: string; bg: string }> = {
    High: { icon: AlertTriangle, accent: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
    Medium: { icon: CreditCard, accent: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
    Low: { icon: Briefcase, accent: 'text-success', bg: 'bg-success/10 border-success/20' },
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* €€ Top Bar €€ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/app/customers" className="p-2 rounded-lg bg-surfaceHighlight hover:bg-white/10 text-textMuted hover:text-textMain transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-textMain tracking-tight">{fullName}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-textMuted">{customer.customer_id_string}</span>
              {risk && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    risk.risk_category === 'High' ? 'bg-danger/15 text-danger border-danger/20' :
                    risk.risk_category === 'Medium' ? 'bg-warning/15 text-warning border-warning/20' :
                    'bg-success/15 text-success border-success/20'
                  }`}
                >
                  <ShieldAlert size={11} /> {risk.risk_category} Risk
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={runPrediction}
            disabled={predicting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-semibold hover:bg-primary/20 transition disabled:opacity-60"
          >
            {predicting ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
            {predicting ? 'Running AI' : 'Run AI Scan'}
          </button>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surfaceHighlight text-textMuted text-sm font-semibold hover:text-textMain transition"
          >
            <RefreshCw size={15} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surfaceHighlight text-textMain text-sm font-semibold hover:bg-white/10 transition">
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* €€ Tabs €€ */}
      <div className="flex gap-1 border-b border-white/10 pb-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-textMuted hover:text-textMain'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* €€ Tab: Overview €€ */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="glass-card space-y-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold flex-shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-bold text-textMain text-lg">{fullName}</p>
                <p className="text-sm text-textMuted">
                  Since {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : ''}
                </p>
              </div>
            </div>
            <InfoRow label="Occupation" value={customer.occupation ?? ''} />
            <InfoRow label="Employer" value={customer.employer ?? ''} />
            <InfoRow label="Monthly Salary" value={formatCurrency(customer.monthly_salary)} />
            <InfoRow label="Other Income" value={formatCurrency(customer.other_income)} />
            <InfoRow label="Dependents" value={customer.family_dependents ?? 0} />
            <InfoRow
              label="Credit Score"
              value={cs != null ? `${cs}  ${cs >= 750 ? 'Excellent' : cs >= 700 ? 'Good' : cs >= 650 ? 'Fair' : 'Poor'}` : ''}
              valueClass={cs == null ? '' : cs >= 750 ? 'text-success' : cs >= 650 ? 'text-warning' : 'text-danger'}
            />
            <InfoRow label="Active Loans" value={loans.filter(l => l.status === 'Active').length} />
          </div>

          {/* Risk Timeline */}
          <div className="glass-card lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-5 flex items-center gap-2">
              <TrendingDown size={16} className="text-danger" /> Risk Score Trend
            </h3>
            {riskTimeline.length >= 2 ? (
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={riskTimeline} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                    <XAxis dataKey="month" stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="score" stroke={riskColor} strokeWidth={2.5}
                      dot={{ fill: '#0B1120', stroke: riskColor, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: riskColor }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-52 flex flex-col items-center justify-center gap-3 text-textMuted">
                <p className="text-sm">Not enough prediction history for trend.</p>
                <button onClick={runPrediction} disabled={predicting} className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition">
                  {predicting ? 'Running' : 'Run First AI Scan'}
                </button>
              </div>
            )}
            {riskTimeline.length >= 2 && (() => {
              const delta = riskTimeline[riskTimeline.length - 1].score - riskTimeline[0].score;
              return (
                <div className={`mt-4 p-3 rounded-lg border text-sm flex items-start gap-2 ${
                  delta > 10 ? 'bg-danger/10 border-danger/20 text-danger' :
                  delta < -10 ? 'bg-success/10 border-success/20 text-success' :
                  'bg-surfaceHighlight border-white/10 text-textMuted'
                }`}>
                  <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                  Risk score <strong className="ml-1">{delta > 0 ? `+${delta}` : delta} points</strong> over scan history.
                  {delta > 10 ? ' Immediate intervention recommended.' : delta < -10 ? ' Customer improving  good trend.' : ' Stable.'}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* €€ Tab: Financials €€ */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          {loans.length === 0 ? (
            <div className="glass-card text-center py-12 text-textMuted">No active loans found for this customer.</div>
          ) : loans.map(loan => {
            const principal = Number(loan.principal_amount);
            const remaining = Number(loan.remaining_balance ?? loan.outstanding_balance ?? 0);
            const paidPct = principal > 0 ? Math.round((1 - remaining / principal) * 100) : 0;
            const emis = emiHistories[loan.id] ?? [];

            return (
              <div key={loan.id} className="space-y-4">
                <div className="glass-card">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-4">
                    {loan.loan_type}  <span className="text-textMain">{loan.status}</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Principal', value: formatCurrency(loan.principal_amount) },
                      { label: 'Interest Rate', value: loan.interest_rate ? `${loan.interest_rate}% p.a.` : '' },
                      { label: 'EMI Amount', value: loan.emi_amount ? `${formatCurrency(loan.emi_amount)}/mo` : '' },
                      { label: 'Remaining Balance', value: formatCurrency(loan.remaining_balance ?? loan.outstanding_balance) },
                    ].map(item => (
                      <div key={item.label} className="p-4 rounded-lg bg-surface border border-white/5 text-center">
                        <p className="text-xs text-textMuted mb-1">{item.label}</p>
                        <p className="text-lg font-bold text-textMain">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-textMuted mb-2">
                      <span>Repayment Progress</span><span>{paidPct}% Paid</span>
                    </div>
                    <div className="w-full h-2 bg-surfaceHighlight rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${paidPct}%` }} />
                    </div>
                  </div>
                </div>

                {emis.length > 0 && (
                  <div className="glass-card">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-4">
                      EMI Payment History  {loan.loan_type}
                    </h3>
                    <div className="space-y-2">
                      {emis.slice(0, 12).map(e => (
                        <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-white/5">
                          <span className="text-sm text-textMuted">
                            {new Date(e.payment_date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-sm font-semibold text-textMain">{formatCurrency(e.amount_paid ?? e.amount_due)}</span>
                          <EMIStatusBadge status={e.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* €€ Tab: AI Intelligence €€ */}
      {activeTab === 'ai-intelligence' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Risk Score Gauge */}
          <div className="glass-card lg:col-span-2 flex flex-col items-center justify-center py-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-6">AI Risk Score</h3>
            {risk ? (
              <>
                <div className="relative w-44 h-44">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path strokeWidth="3" stroke="#1F2937" fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path strokeWidth="3" strokeDasharray={`${risk.risk_score}, 100`} stroke={riskColor} fill="none" strokeLinecap="round"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-black leading-none`} style={{ color: riskColor }}>{risk.risk_score}</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-textMuted mt-1">/100</span>
                  </div>
                </div>
                <div className="mt-6 w-full space-y-2 text-sm">
                  <div className="flex justify-between p-2 rounded bg-surface border border-white/5">
                    <span className="text-textMuted">Default Probability</span>
                    <span className={`font-bold ${categoryColor}`}>{(Number(risk.default_probability) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-surface border border-white/5">
                    <span className="text-textMuted">Category</span>
                    <span className={`font-bold ${categoryColor}`}>{risk.risk_category} Risk</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-surface border border-white/5">
                    <span className="text-textMuted">Last Scanned</span>
                    <span className="font-bold text-textMain">
                      {risk.prediction_date ? new Date(risk.prediction_date).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </span>
                  </div>
                </div>
                <button
                  onClick={runPrediction}
                  disabled={predicting}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
                >
                  {predicting ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
                  {predicting ? 'Running AI' : 'Re-run AI Scan'}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 text-textMuted">
                <p className="text-sm text-center">No AI prediction yet for this customer.</p>
                <button
                  onClick={runPrediction}
                  disabled={predicting}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
                >
                  {predicting ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
                  {predicting ? 'Running AI' : 'Run AI Scan Now'}
                </button>
              </div>
            )}
          </div>

          {/* SHAP Explainability */}
          <div className="glass-card lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-1">
              Explainable AI  Why is this score {risk?.risk_score ?? '?'}?
            </h3>
            <p className="text-xs text-textMuted mb-5">Red bars increase risk. Green bars decrease risk.</p>
            {shapFeatures.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shapFeatures} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 140 }}>
                    <XAxis type="number" hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 11 }} width={140} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: 8 }}
                      itemStyle={{ color: '#F9FAFB' }}
                    />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                      {shapFeatures.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#EF4444' : '#10B981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-textMuted text-sm">
                Run an AI scan to see SHAP explanations.
              </div>
            )}

            {/* Recommendations */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted">AI Recommendations</h3>
              {(risk?.recommendations ?? []).length > 0 ? (
                (risk?.recommendations ?? []).map(rec => {
                  const style = priorityMap[rec.priority] ?? priorityMap['Medium'];
                  const Icon = style.icon;
                  return (
                    <div key={rec.id} className={`flex gap-3 p-4 rounded-lg border ${style.bg}`}>
                      <Icon size={18} className={`${style.accent} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${style.accent}`}>{rec.action_text}</p>
                        <p className="text-xs text-textMuted mt-0.5">Status: {rec.status}</p>
                      </div>
                      <span className={`flex-shrink-0 px-2 h-5 rounded text-xs font-bold self-start ${style.accent}`}>
                        {rec.priority}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-textMuted">No recommendations yet. Run an AI scan to generate them.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* €€ Tab: Documents €€ */}
      {activeTab === 'documents' && (
        <div className="glass-card">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-4">Uploaded Documents</h3>
          <div className="py-12 text-center text-textMuted">
            <p className="text-sm">Document management coming soon.</p>
            <p className="text-xs mt-1">Upload salary slips, bank statements, and ITR files for AI processing.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;

