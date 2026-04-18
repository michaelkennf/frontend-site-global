const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(error.message ?? `Erreur ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ───────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ access_token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  profile: () => request<AdminUser>('/auth/profile', {}, true),
};

// ── Uploads ─────────────────────────────────────────────────────────
export const uploadsApi = {
  uploadImage: async (file: File): Promise<string> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/uploads/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Erreur upload' }));
      throw new Error(error.message ?? `Erreur ${res.status}`);
    }

    const data = (await res.json()) as { url: string };
    if (data.url.startsWith('http')) return data.url;
    return `${API_ORIGIN}${data.url}`;
  },
};

// ── Activities ─────────────────────────────────────────────────────
export const activitiesApi = {
  getPublic: () => request<Activity[]>('/activities/public'),
  getOnePublic: (id: string) => request<Activity>(`/activities/public/${id}`),
  getAll: () => request<Activity[]>('/activities', {}, true),
  create: (data: Partial<Activity>) =>
    request<Activity>('/activities', { method: 'POST', body: JSON.stringify(data) }, true),
  update: (id: string, data: Partial<Activity>) =>
    request<Activity>(`/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
  delete: (id: string) =>
    request<void>(`/activities/${id}`, { method: 'DELETE' }, true),
};

// ── Messages ───────────────────────────────────────────────────────
export const messagesApi = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    request<Message>('/messages', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => request<Message[]>('/messages', {}, true),
  markRead: (id: string) =>
    request<Message>(`/messages/${id}/read`, { method: 'PUT' }, true),
  delete: (id: string) =>
    request<void>(`/messages/${id}`, { method: 'DELETE' }, true),
  getStats: () => request<{ total: number; unread: number }>('/messages/stats', {}, true),
};

// ── Stats ──────────────────────────────────────────────────────────
export const statsApi = {
  getImpact: () => request<ImpactStat>('/stats/impact'),
  updateImpact: (data: Partial<ImpactStat>) =>
    request<ImpactStat>('/stats/impact', { method: 'PUT', body: JSON.stringify(data) }, true),
  getDashboard: () => request<DashboardStats>('/stats/dashboard', {}, true),
};

// ── Donations ──────────────────────────────────────────────────────
export const donationsApi = {
  getInfo: () => request<DonationInfo>('/donations/info'),
  updateInfo: (data: Partial<DonationInfo>) =>
    request<DonationInfo>('/donations/info', { method: 'PUT', body: JSON.stringify(data) }, true),
  create: (data: Partial<Donation>) =>
    request<Donation>('/donations', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => request<Donation[]>('/donations', {}, true),
  getStats: () => request<DonationStats>('/donations/stats', {}, true),
};

// ── Newsletter ─────────────────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) =>
    request<{ message: string }>('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
  getAll: () => request<NewsletterSubscriber[]>('/newsletter', {}, true),
  getStats: () => request<{ total: number; active: number }>('/newsletter/stats', {}, true),
  delete: (id: string) =>
    request<void>(`/newsletter/${id}`, { method: 'DELETE' }, true),
};

// ── Partners ───────────────────────────────────────────────────────
export const partnersApi = {
  getPublic: () => request<Partner[]>('/partners'),
  getAll: () => request<Partner[]>('/partners/admin', {}, true),
  create: (data: Partial<Partner>) =>
    request<Partner>('/partners', { method: 'POST', body: JSON.stringify(data) }, true),
  update: (id: string, data: Partial<Partner>) =>
    request<Partner>(`/partners/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
  delete: (id: string) =>
    request<void>(`/partners/${id}`, { method: 'DELETE' }, true),
};

// ── Team ───────────────────────────────────────────────────────────
export const teamApi = {
  getPublic: () => request<TeamMember[]>('/team'),
  getAll: () => request<TeamMember[]>('/team/admin', {}, true),
  create: (data: Partial<TeamMember>) =>
    request<TeamMember>('/team', { method: 'POST', body: JSON.stringify(data) }, true),
  update: (id: string, data: Partial<TeamMember>) =>
    request<TeamMember>(`/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
  delete: (id: string) =>
    request<void>(`/team/${id}`, { method: 'DELETE' }, true),
};

// ── Users ──────────────────────────────────────────────────────────
export const usersApi = {
  getAll: () => request<AdminUser[]>('/users', {}, true),
  create: (data: Partial<AdminUser> & { password: string }) =>
    request<AdminUser>('/users', { method: 'POST', body: JSON.stringify(data) }, true),
  update: (id: string, data: Partial<AdminUser>) =>
    request<AdminUser>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
  delete: (id: string) =>
    request<void>(`/users/${id}`, { method: 'DELETE' }, true),
};

// ── Site Media ─────────────────────────────────────────────────────
export const siteMediaApi = {
  getBySection: (section: string) => request<SiteMedia[]>(`/site-media/public?section=${section}`),
  /** Média public par clé unique (hero, en-têtes, domaines…). Null si absent. */
  getPublicByKey: async (key: string): Promise<SiteMedia | null> => {
    const res = await fetch(`${API_BASE}/site-media/public/key/${encodeURIComponent(key)}`)
    if (res.status === 404) return null
    if (!res.ok) return null
    const data = (await res.json()) as SiteMedia | null
    return data ?? null
  },
  getAll: () => request<SiteMedia[]>('/site-media', {}, true),
  create: (data: Partial<SiteMedia>) =>
    request<SiteMedia>('/site-media', { method: 'POST', body: JSON.stringify(data) }, true),
  update: (id: string, data: Partial<SiteMedia>) =>
    request<SiteMedia>(`/site-media/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
  delete: (id: string) =>
    request<void>(`/site-media/${id}`, { method: 'DELETE' }, true),
};

// ── Types ──────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'GESTIONNAIRE';
  isActive: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  image?: string;
  location: string;
  date: string;
  status: 'ONGOING' | 'COMPLETED';
  createdAt: string;
  author?: { id: string; name: string };
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ImpactStat {
  id: string;
  communities: number;
  trained: number;
  responses: number;
  initiatives: number;
}

export interface DashboardStats {
  articles: number;
  activities: number;
  unreadMessages: number;
  totalDonations: number;
  donationCount: number;
  activeSubscribers: number;
}

export interface DonationInfo {
  id: string;
  mpesaNumber: string;
  mpesaName: string;
  airtelMoneyNumber: string;
  airtelMoneyName: string;
  orangeMoneyNumber: string;
  orangeMoneyName: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankSwift: string;
  bankIban: string;
  donationDescription: string;
}

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  method: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  notes?: string;
  createdAt: string;
}

export interface DonationStats {
  totalAmount: number;
  count: number;
  pending: number;
  uniqueDonors: number;
  averageAmount: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  active: boolean;
  subscribedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteMedia {
  id: string;
  key: string;
  url: string;
  altFr: string;
  altEn: string;
  section: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  nameFr: string;
  nameEn: string;
  roleFr: string;
  roleEn: string;
  bio?: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
