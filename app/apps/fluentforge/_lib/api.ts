const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
    const err = new Error(error.detail || `API error: ${res.status}`) as any;
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  tier: "free" | "pro";
  created_at: string;
}

export interface RewriteResponse {
  original_text: string;
  rewritten_text: string;
  micro_lessons: Array<{
    original: string;
    rewritten: string;
    explanation: string;
  }>;
}

export interface MicroLesson {
  original: string;
  rewritten: string;
  explanation: string;
}

export interface RewriteSession {
  id: string;
  original_text: string;
  rewritten_text: string;
  micro_lessons: MicroLesson[];
  created_at: string;
}

export interface Subscription {
  status: "inactive" | "active" | "paused" | "canceled";
  tier: "free" | "pro";
  current_period_end: string | null;
  price_id: string | null;
}

export interface UsageResponse {
  current_date_usage: number;
  daily_limit: number;
  remaining: number;
}

export const authApi = {
  register: (email: string, password: string, display_name?: string) =>
    apiFetch<{ status: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ status: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),

  me: () =>
    apiFetch<{ user: User; subscription_status: string }>("/api/auth/me"),

  subscription: () =>
    apiFetch<Subscription>("/api/auth/subscription"),
};

export const paddleApi = {
  verifyTransaction: (transaction_id: string) =>
    apiFetch<{ status: string; tier: string }>("/api/paddle/verify-transaction", {
      method: "POST",
      body: JSON.stringify({ transaction_id }),
    }),
};

export const rewriteApi = {
  rewrite: (text: string) =>
    apiFetch<RewriteResponse>("/api/rewrite", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  history: () =>
    apiFetch<{ sessions: RewriteSession[] }>("/api/history"),

  usage: () =>
    apiFetch<UsageResponse>("/api/usage"),
};

export const settingsApi = {
  getKeys: () =>
    apiFetch<{ keys: Array<{ key_name: string; masked_key: string }> }>(
      "/api/settings/keys"
    ),

  saveKey: (encrypted_key: string) =>
    apiFetch<{ key_name: string; masked_key: string }>(
      "/api/settings/keys",
      {
        method: "POST",
        body: JSON.stringify({ encrypted_key }),
      }
    ),
};
