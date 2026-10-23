/**
 * Sona Luxury Hotel - Admin Application Helper
 * Handles layout logic, sidebar navigation, user badge rendering, modals, and formatting.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminLayout();
});

function initAdminLayout() {
  // Check auth first if not on login page
  if (!window.location.pathname.endsWith('login.html')) {
    if (!SonaAPI.checkAuth()) return;
  }

  // Populate logged in user details
  const user = SonaAPI.getUser();
  if (user) {
    const nameEls = document.querySelectorAll('.user-info-name');
    const roleEls = document.querySelectorAll('.user-info-role');
    const avatarEls = document.querySelectorAll('.user-avatar-img');

    nameEls.forEach(el => el.textContent = user.full_name || user.username);
    roleEls.forEach(el => el.textContent = user.role || 'Admin');
    avatarEls.forEach(el => {
      if (user.avatar && !user.avatar.includes('default')) {
        el.src = user.avatar.startsWith('http') || user.avatar.startsWith('/') || user.avatar.startsWith('img/') 
          ? user.avatar 
          : `/${user.avatar}`;
      } else {
        el.src = '../img/room/avatar/avatar-1.jpg';
      }
    });
  }

  // Mobile sidebar toggle
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const sidebar = document.querySelector('.admin-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Logout button
  const logoutBtns = document.querySelectorAll('.btn-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to sign out of Sona Hotel Admin?')) {
        SonaAPI.logout();
      }
    });
  });

  // Modal backdrop click close
  document.querySelectorAll('.sona-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // Fetch badges (pending bookings & unread messages) for sidebar
  fetchSidebarBadges();
}

async function fetchSidebarBadges() {
  try {
    const res = await SonaAPI.dashboard.getMetrics();
    if (res && res.data && res.data.kpi) {
      const kpi = res.data.kpi;
      const bookingBadge = document.getElementById('sidebar-badge-bookings');
      if (bookingBadge) {
        if (kpi.pendingBookings > 0) {
          bookingBadge.textContent = kpi.pendingBookings;
          bookingBadge.style.display = 'inline-block';
        } else {
          bookingBadge.style.display = 'none';
        }
      }

      const msgBadge = document.getElementById('sidebar-badge-messages');
      if (msgBadge) {
        if (kpi.unreadInquiries > 0) {
          msgBadge.textContent = kpi.unreadInquiries;
          msgBadge.style.display = 'inline-block';
        } else {
          msgBadge.style.display = 'none';
        }
      }
    }
  } catch (e) {
    // Silent fail for non-critical badges
  }
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Formatting Helpers
function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getStatusBadge(status) {
  const s = (status || '').toLowerCase();
  let label = s.replace('_', ' ');
  label = label.charAt(0).toUpperCase() + label.slice(1);
  return `<span class="badge-status badge-${s}">${label}</span>`;
}

function getPaymentBadge(status) {
  const s = (status || 'unpaid').toLowerCase();
  const label = s.charAt(0).toUpperCase() + s.slice(1);
  return `<span class="badge-status badge-${s}">${label}</span>`;
}
