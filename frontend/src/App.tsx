import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sparkles, Send, X, Bot, HelpCircle, Loader2 } from 'lucide-react';

import TopNavbar from './components/TopNavbar';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerProfile from './pages/CustomerProfile';
import LoanManagement from './pages/LoanManagement';
import DataUpload from './pages/DataUpload';
import RiskAnalytics from './pages/RiskAnalytics';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Settings from './pages/Settings';
import StressTesting from './pages/StressTesting';
import FraudDetection from './pages/FraudDetection';
import IntroLoader from './components/IntroLoader';

// ─── AI Copilot Chat Drawer ──────────────────────────────────────────────────
interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const CopilotDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your Credence Copilot. How can I help you analyze credit risk or portfolio intelligence today?',
      timestamp: '06:00 PM'
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const getAIResponse = (userText: string): string => {
    const text = userText.toLowerCase();
    if (text.includes('portfolio') || text.includes('exposure') || text.includes('health')) {
      return "Current portfolio health score is 72%. Active exposure stands at ₹8,420 Cr. The overall default probability is stable at 2.4% across 10,000 active borrowers.";
    }
    if (text.includes('cust-8492') || text.includes('john') || text.includes('doe')) {
      return "John Doe (CUST-8492) is flagged as High Risk (score: 85/100). The primary risk drivers are: 2 missed EMIs recently, a 30% decrease in monthly salary, and 60% credit utilization. Restructuring is recommended.";
    }
    if (text.includes('high risk') || text.includes('critical') || text.includes('alerts')) {
      return "There are currently 12 active Critical alerts. The most urgent is a risk score jump to 85 for CUST-8492 (John Doe). You can view the full breakdown in the 'Risk Analytics' tab.";
    }
    if (text.includes('help') || text.includes('what can you do')) {
      return "I can analyze borrower profiles, summarize portfolio risk, search for high-risk accounts, or provide restructuring recommendation summaries. Try asking about 'CUST-8492' or 'portfolio status'.";
    }
    return "I've run that query through the Credence Risk Model v4.2. Currently, the indicators look stable. Is there a specific borrower ID or loan account you would like me to check?";
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // User message
    const userMsg: Message = { sender: 'user', text: textToSend, timestamp: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiReply: Message = {
        sender: 'ai',
        text: getAIResponse(textToSend),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiReply]);
      setTyping(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-[#0e0b1a]/95 border-l border-white/5 shadow-2xl z-50 flex flex-col backdrop-blur-2xl animate-fade-in-up font-sans">
      {/* Top Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent-purple p-[1px] shadow-lg shadow-primary/10">
            <div className="w-full h-full rounded-full bg-[#100e1a] flex items-center justify-center">
              <Sparkles size={14} className="text-primary animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-textMain font-sans">Credence Copilot</h3>
            <p className="text-[9px] font-mono text-[#10b981] uppercase tracking-wider mt-0.5">AI Assistant Active</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-textMuted hover:text-textMain hover:bg-white/5 transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex gap-2.5 max-w-[85%]">
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  <Bot size={14} />
                </div>
              )}
              <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                m.sender === 'user'
                  ? 'bg-gradient-to-tr from-primary to-accent-purple text-white shadow-lg shadow-primary/10 rounded-tr-none'
                  : 'bg-white/[0.03] text-textMain border border-white/5 rounded-tl-none'
              }`}>
                <p>{m.text}</p>
                <span className="text-[8px] font-mono text-textMuted/60 block text-right mt-1.5">{m.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 max-w-[80%]">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                <Bot size={14} />
              </div>
              <div className="bg-white/[0.03] border border-white/5 text-textMuted p-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5">
                <Loader2 size={12} className="animate-spin text-primary" />
                <span>Copilot is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01]">
        <p className="text-[9px] font-mono text-textMuted uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <HelpCircle size={10} /> Suggested Queries
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Analyze CUST-8492', query: 'Summarize CUST-8492 risk factors' },
            { label: 'Portfolio Health', query: 'What is our portfolio health?' },
            { label: 'Active Alerts', query: 'Show active critical alerts' }
          ].map(p => (
            <button
              key={p.label}
              onClick={() => handleSend(p.query)}
              className="text-[10px] font-semibold text-textMuted hover:text-primary px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/8 hover:border-primary/20 hover:bg-primary/5 transition duration-300 font-sans"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => { e.preventDefault(); handleSend(input); }}
        className="p-4 border-t border-white/5 bg-[#0e0b1a] flex gap-2"
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Copilot something..."
          className="flex-1 bg-white/[0.03] border border-white/8 rounded-xl px-3 py-2 text-xs text-textMain placeholder-textMuted focus:outline-none focus:border-primary/50 transition font-sans"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent-purple text-white shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

const AppLayout = ({ children, onOpenCopilot }: { children: React.ReactNode; onOpenCopilot: () => void }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-x-hidden">
      {/* Premium Minimalist Tech Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      
      {/* Floating Classy/Aesthetic Background Glows */}
      <div className="absolute top-[8%] left-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-primary/5 to-accent-purple/5 blur-[130px] pointer-events-none animate-pulse-glow z-0" style={{ animationDuration: '14s' }} />
      <div className="absolute bottom-[15%] right-[5%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-accent-purple/4 to-[#20c997]/3 blur-[150px] pointer-events-none animate-pulse-glow z-0" style={{ animationDuration: '20s', animationDelay: '2s' }} />
      
      {/* Extra Subtle Tech Elements: Top Neon Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/35 to-transparent pointer-events-none z-20" />



      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNavbar onOpenCopilot={onOpenCopilot} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// ─── Query Client ──────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [copilotOpen, setCopilotOpen] = useState(false);

  // Keyboard shortcut Ctrl+K to toggle copilot drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCopilotOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <IntroLoader />
      <BrowserRouter basename="/CREDENCE_AI">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app/*" element={
            <div className="relative min-h-screen w-full">
              <AppLayout onOpenCopilot={() => setCopilotOpen(true)}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard onOpenCopilot={() => setCopilotOpen(true)} />} />
                  <Route path="customers" element={<CustomerList />} />
                  <Route path="customers/:id" element={<CustomerProfile />} />
                  <Route path="loans" element={<LoanManagement />} />
                  <Route path="upload" element={<DataUpload />} />
                  <Route path="analytics" element={<RiskAnalytics />} />
                  <Route path="stress-testing" element={<StressTesting />} />
                  <Route path="fraud-detection" element={<FraudDetection />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </AppLayout>
              
              {/* Overlay background when drawer is open */}
              {copilotOpen && (
                <div
                  onClick={() => setCopilotOpen(false)}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-all duration-300"
                />
              )}
              
              {/* Drawer */}
              <CopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
