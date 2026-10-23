/**
 * Sona Luxury Hotel - Admin API Client
 * Handles token storage, request wrapping, notifications, and endpoints.
 */

const API_BASE = window.location.origin.includes(':5000') 
  ? '/api' 
  : 'http://localhost:5000/api';

const SonaAPI = {
  // Token & Auth Storage
  getToken() {
    return localStorage.getItem('sona_admin_token');
  },

  setToken(token) {
    localStorage.setItem('sona_admin_token', token);
  },

  getUser() {
    try {
      const u = localStorage.getItem('sona_admin_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem('sona_admin_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('sona_admin_token');
    localStorage.removeItem('sona_admin_user');
    window.location.href = 'login.html';
  },

  checkAuth() {
    const token = this.getToken();
    if (!token) {
      if (!window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
      }
      return false;
    }
    return true;
  },

  // Notification Toast Helper
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `sona-toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-triangle';
    if (type === 'warning') icon = 'fa-bell';

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fa ${icon}" style="color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#dfa974'}"></i>
        <span>${message}</span>
      </div>
      <button style="background:transparent; border:none; color:#888; cursor:pointer; font-size:16px; margin-left:12px;" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Base HTTP Request Wrapper
  async request(endpoint, options = {}) {
    const headers = options.headers || {};
    const token = this.getToken();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Set JSON header only if body is not FormData
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    options.headers = headers;

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        this.showToast('Session expired. Please sign in again.', 'warning');
        setTimeout(() => this.logout(), 1000);
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed with status ' + response.status);
      }

      return data;
    } catch (err) {
      if (err.message !== 'Unauthorized') {
        console.error(`API Error [${endpoint}]:`, err);
      }
      throw err;
    }
  },

  // API Domain Endpoints
  auth: {
    login: (usernameOrEmail, password) => 
      SonaAPI.request('/auth/login', { method: 'POST', body: { usernameOrEmail, password } }),
    getMe: () => SonaAPI.request('/auth/me'),
    updateProfile: (formData) => SonaAPI.request('/auth/profile', { method: 'PUT', body: formData }),
    changePassword: (currentPassword, newPassword) => 
      SonaAPI.request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),
    getUsers: () => SonaAPI.request('/auth/users')
  },

  dashboard: {
    getMetrics: () => SonaAPI.request('/dashboard/metrics')
  },

  bookings: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return SonaAPI.request(`/bookings?${qs}`);
    },
    getById: (id) => SonaAPI.request(`/bookings/${id}`),
    create: (bookingData) => SonaAPI.request('/bookings', { method: 'POST', body: bookingData }),
    update: (id, bookingData) => SonaAPI.request(`/bookings/${id}`, { method: 'PUT', body: bookingData }),
    updateStatus: (id, status) => SonaAPI.request(`/bookings/${id}/status`, { method: 'PATCH', body: { status } }),
    updatePayment: (id, payment_status, payment_method) => 
      SonaAPI.request(`/bookings/${id}/payment`, { method: 'PATCH', body: { payment_status, payment_method } }),
    delete: (id) => SonaAPI.request(`/bookings/${id}`, { method: 'DELETE' })
  },

  rooms: {
    getAll: () => SonaAPI.request('/rooms'),
    getById: (id) => SonaAPI.request(`/rooms/${id}`),
    create: (roomData) => SonaAPI.request('/rooms', { method: 'POST', body: roomData }),
    update: (id, roomData) => SonaAPI.request(`/rooms/${id}`, { method: 'PUT', body: roomData }),
    updateStatus: (id, status) => SonaAPI.request(`/rooms/${id}/status`, { method: 'PATCH', body: { status } }),
    delete: (id) => SonaAPI.request(`/rooms/${id}`, { method: 'DELETE' }),
    getStats: () => SonaAPI.request('/rooms/stats')
  },

  services: {
    getAll: () => SonaAPI.request('/services'),
    create: (data) => SonaAPI.request('/services', { method: 'POST', body: data }),
    update: (id, data) => SonaAPI.request(`/services/${id}`, { method: 'PUT', body: data }),
    toggle: (id, is_active) => SonaAPI.request(`/services/${id}/toggle`, { method: 'PATCH', body: { is_active } }),
    delete: (id) => SonaAPI.request(`/services/${id}`, { method: 'DELETE' })
  },

  blogs: {
    getAll: () => SonaAPI.request('/blogs'),
    getById: (id) => SonaAPI.request(`/blogs/${id}`),
    create: (data) => SonaAPI.request('/blogs', { method: 'POST', body: data }),
    update: (id, data) => SonaAPI.request(`/blogs/${id}`, { method: 'PUT', body: data }),
    delete: (id) => SonaAPI.request(`/blogs/${id}`, { method: 'DELETE' })
  },

  testimonials: {
    getAll: () => SonaAPI.request('/testimonials'),
    create: (data) => SonaAPI.request('/testimonials', { method: 'POST', body: data }),
    toggle: (id, is_approved) => SonaAPI.request(`/testimonials/${id}/toggle`, { method: 'PATCH', body: { is_approved } }),
    delete: (id) => SonaAPI.request(`/testimonials/${id}`, { method: 'DELETE' })
  },

  messages: {
    getAll: () => SonaAPI.request('/messages'),
    getById: (id) => SonaAPI.request(`/messages/${id}`),
    updateStatus: (id, status, reply_notes) => 
      SonaAPI.request(`/messages/${id}/status`, { method: 'PATCH', body: { status, reply_notes } }),
    delete: (id) => SonaAPI.request(`/messages/${id}`, { method: 'DELETE' })
  },

  settings: {
    getAll: () => SonaAPI.request('/settings'),
    update: (settingsMap) => SonaAPI.request('/settings', { method: 'POST', body: settingsMap })
  }
};
