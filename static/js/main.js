let token = localStorage.getItem('access_token');

// Auth Header
function authHeader() {
  return { 'Authorization': `Bearer ${token}` };
}

// Toast System
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Debounce
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Tab Switching
document.querySelectorAll('[data-tab]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('a[data-tab]').forEach(b => b.classList.remove('active-tab'));
    document.getElementById(btn.dataset.tab).classList.remove('hidden');
    btn.classList.add('active-tab');
  });
});

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    fetch('/api/users/logout/', {
      method: 'POST',
      headers: { 'X-CSRFToken': CSRF_TOKEN }
    }).finally(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login/';
    });
  });
}

// === LIVE VALIDATION (Debounced) ===
['username', 'email'].forEach(field => {
  const input = document.getElementById(field);
  const error = document.getElementById(`${field}-error`);

  if (input && error) {
    input.addEventListener('input', debounce(() => {
      const value = input.value;
      if (value.length < 3) {
        error.textContent = '';
        error.classList.add('hidden');
        return;
      }

      fetch(`/api/users/register/?check=${field}&value=${encodeURIComponent(value)}`)
        .then(res => res.json())
        .then(data => {
          if (data.exists) {
            error.textContent = `This ${field} is already taken.`;
            error.classList.remove('hidden');
            input.classList.add('ring', 'ring-pink-400');
          } else {
            error.classList.add('hidden');
            input.classList.remove('ring', 'ring-pink-400');
          }
        })
        .catch(() => {
          error.textContent = 'Connection error.';
          error.classList.remove('hidden');
        });
    }, 500));
  }
});

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    fetch('/api/users/register/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRF_TOKEN
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        showToast(data.message);
        setTimeout(() => window.location.href = '/login/', 1000);
      } else {
        Object.keys(data).forEach(key => {
          showToast(`${key}: ${data[key]}`, 'error');
        });
      }
    })
    .catch(() => showToast('Network error.', 'error'));
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('/api/users/login/', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRF_TOKEN
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        window.location.href = '/dashboard/';
      } else {
        showToast('Invalid credentials.', 'error');
      }
    })
    .catch(() => showToast('Login failed.', 'error'));
  });
}

// Load & Update Profile
function loadProfile() {
  fetch('/api/users/profile/', { headers: authHeader() })
    .then(res => res.json())
    .then(data => {
      Object.keys(data).forEach(key => {
        const el = document.getElementById(key);
        if (el) el.value = data[key] || '';
      });
    })
    .catch(() => showToast('Failed to load profile.', 'error'));
}

const profileForm = document.getElementById('profileForm');
if (profileForm) {
  profileForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('/api/users/profile/', {
      method: 'PUT',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRF_TOKEN
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.full_name) {
        showToast('Profile updated!');
      } else {
        showToast('Update failed.', 'error');
      }
    })
    .catch(() => showToast('Network error.', 'error'));
  });
}

// Change Password
const passwordForm = document.getElementById('passwordForm');
if (passwordForm) {
  passwordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('/api/users/change-password/', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRF_TOKEN
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        showToast(data.message);
        passwordForm.reset();
      } else {
        showToast('Password change failed.', 'error');
      }
    })
    .catch(() => showToast('Network error.', 'error'));
  });
}

// Notes: CRUD
function loadNotes(page = 1, search = '') {
  fetch(`/api/notes/notes/?page=${page}&search=${search}`, {
    headers: authHeader()
  })
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('notesList');
    container.innerHTML = '';

    if (data.results.length === 0) {
      container.innerHTML = '<p class="text-white opacity-70 text-center py-4">No notes found.</p>';
      return;
    }

    data.results.forEach(note => {
      const el = document.createElement('div');
      el.className = 'glass-card';
      el.innerHTML = `
        <h3 class="text-xl font-bold text-white">${note.title}</h3>
        <p class="text-white opacity-90 mt-1">${note.description || ''}</p>
        ${note.attachment ? `<a href="${note.attachment}" target="_blank" class="text-secondary-300 text-sm mt-1 block">${note.filename}</a>` : ''}
        <p class="text-xs text-white opacity-60 mt-2">
          Created: ${new Date(note.created_at).toLocaleString()}
        </p>
        <button onclick="deleteNote(${note.id})" class="text-red-300 hover:text-red-100 text-sm mt-2">🗑️ Delete</button>
      `;
      container.appendChild(el);
    });

    // Pagination
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    if (data.previous) {
      const btn = document.createElement('button');
      btn.textContent = '← Prev';
      btn.onclick = () => loadNotes(data.previous.split('page=')[1], search);
      pagination.appendChild(btn);
    }
    if (data.next) {
      const btn = document.createElement('button');
      btn.textContent = 'Next →';
      btn.onclick = () => loadNotes(data.next.split('page=')[1], search);
      pagination.appendChild(btn);
    }
  })
  .catch(() => showToast('Failed to load notes.', 'error'));
}

// Search Notes
const searchNotes = document.getElementById('searchNotes');
if (searchNotes) {
  searchNotes.addEventListener('input', debounce(function () {
    loadNotes(1, this.value);
  }, 400));
}

// Add Note
const noteForm = document.getElementById('noteForm');
if (noteForm) {
  noteForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('/api/notes/notes/', {
      method: 'POST',
      body: formData,
      headers: authHeader()
    })
    .then(res => res.json())
    .then(data => {
      if (data.id) {
        showToast('Note added!');
        noteForm.reset();
        loadNotes();
      }
    })
    .catch(() => showToast('Failed to add note.', 'error'));
  });
}

// Delete Note
function deleteNote(id) {
  fetch(`/api/notes/notes/${id}/`, {
    method: 'DELETE',
    headers: authHeader()
  })
  .then(() => {
    showToast('Note deleted!');
    loadNotes();
  })
  .catch(() => showToast('Delete failed.', 'error'));
}

// On Dashboard Load
if (window.location.pathname === '/dashboard/') {
  if (!token) window.location.href = '/login/';
  loadProfile();
  loadNotes();
}