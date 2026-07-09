/**
 * Credence AI  Centralized API Client
 * All requests to the FastAPI backend go through this module.
 */

const BASE_URL = 'https://credence-ai-te1m.onrender.com/api/v1';

// €€ Token helpers €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
export function getToken(): string | null {
  return localStorage.getItem('access_token');
}

export function setToken(token: string) {
  localStorage.setItem('access_token', token);
}

export function clearToken() {
  localStorage.removeItem('access_token');
}

// €€ Core fetch wrapper €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    clearToken();
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

// €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
// €€ Types €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
// €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Customer {
  id: string;
  customer_id_string: string;
  first_name: string;
  last_name: string;
  occupation?: string;
  employer?: string;
  monthly_salary?: number;
  other_income?: number;
  credit_score?: number;
  family_dependents?: number;
  created_at?: string;
}

export interface Loan {
  id: string;
  customer_id: string;
  loan_type: string;
  principal_amount: number;
  outstanding_balance?: number;
  remaining_balance?: number;
  emi_amount?: number;
  interest_rate?: number;
  tenure_months?: number;
  status: string;
  disbursement_date?: string;
}

export interface EMIHistory {
  id: string;
  loan_id: string;
  payment_date: string;
  amount_due: number;
  amount_paid?: number;
  status: string;
}

export interface SHAPFeature {
  feature: string;
  impact: number;
}

export interface Recommendation {
  id: string;
  prediction_id: string;
  action_text: string;
  priority: string;
  status: string;
  created_at?: string;
}

export interface Prediction {
  id: string;
  customer_id: string;
  default_probability: number;
  risk_score: number;
  risk_category: string;
  shap_explanations?: { features: SHAPFeature[] };
  prediction_date?: string;
  recommendations?: Recommendation[];
}

export interface Alert {
  id: string;
  customer_id: string;
  alert_message: string;
  is_read: boolean;
  created_at?: string;
}

export interface AlertListOut {
  total: number;
  alerts: Alert[];
}

export interface CustomerListOut {
  total: number;
  customers: Customer[];
}

// €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
// €€ Auth API €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
// €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€

export const authApi = {
  async login(email: string, password: string): Promise<TokenResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    return response.json();
  },

  async register(payload: {
    email: string; password: string; first_name: string; last_name: string; role_id?: string;
  }): Promise<TokenResponse> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return response.json();
  },

  async getRoles(): Promise<{ id: string; name: string }[]> {
    const res = await fetch(`${BASE_URL}/auth/roles`);
    if (!res.ok) return [];
    return res.json();
  },

  async getMe() {
    return request<{ id: string; email: string; full_name: string; role: string }>('/auth/me');
  },
};

// €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
// €€ Customer API €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
// €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€

export const customerApi = {
  list(skip = 0, limit = 100, search?: string): Promise<CustomerListOut> {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    if (search) params.set('search', search);
    return request<CustomerListOut>(`/customers?${params}`);
  },

  get(id: string): Promise<Customer> {
    return request<Customer>(`/customers/${id}`);
  },

  getLoans(id: string): Promise<Loan[]> {
    return request<Loan[]>(`/customers/${id}/loans`);
  },

  create(payload: Partial<Customer>): Promise<Customer> {
    return request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
// €€ Loans API €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
// €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€

export const loanApi = {
  getEmiHistory(loanId: string): Promise<EMIHistory[]> {
    return request<EMIHistory[]>(`/loans/${loanId}/emi-history`);
  },
};

// €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
// €€ AI API €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
// €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€

export const aiApi = {
  /** Run a fresh AI prediction for a customer and persist results */
  runPrediction(customerId: string): Promise<Prediction> {
    return request<Prediction>(`/ai/predict/${customerId}`, { method: 'POST' });
  },

  /** Get all historical predictions for a customer */
  getCustomerPredictions(customerId: string): Promise<Prediction[]> {
    return request<Prediction[]>(`/ai/predictions/customer/${customerId}`);
  },

  /** Get system-wide risk alerts */
  getAlerts(skip = 0, limit = 100): Promise<AlertListOut> {
    return request<AlertListOut>(`/ai/alerts?skip=${skip}&limit=${limit}`);
  },

  /** Trigger batch risk score recalculation for all customers */
  recalculateAll(): Promise<{ message: string }> {
    return request<{ message: string }>('/ai/recalculate', { method: 'POST' });
  },
};



