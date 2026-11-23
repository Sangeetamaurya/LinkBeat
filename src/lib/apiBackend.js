const API_BASE = __DEV__ ? 'http://localhost:5000/api' : 'https://your-production-api.com/api';

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function getToken() {
  try {
    return globalThis.__LINKBEAT_TOKEN__ || null;
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  globalThis.__LINKBEAT_TOKEN__ = token;
}

export function clearAuthToken() {
  globalThis.__LINKBEAT_TOKEN__ = null;
}

export const authAPI = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export const playlistAPI = {
  getAll: () => request('/playlists'),
  get: (id) => request(`/playlists/${id}`),
  create: (data) => request('/playlists', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/playlists/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/playlists/${id}`, { method: 'DELETE' }),
  addSong: (id, songId) => request(`/playlists/${id}/songs`, { method: 'POST', body: JSON.stringify({ songId }) }),
  removeSong: (id, songId) => request(`/playlists/${id}/songs/${songId}`, { method: 'DELETE' }),
  reorder: (id, songIds) => request(`/playlists/${id}/reorder`, { method: 'PUT', body: JSON.stringify({ songIds }) }),
};

export const songAPI = {
  search: (query, limit = 20) => request(`/songs/search?q=${encodeURIComponent(query)}&limit=${limit}`),
  getByIds: (ids) => request('/songs/by-ids', { method: 'POST', body: JSON.stringify({ ids }) }),
  get: (trackId) => request(`/songs/${trackId}`),
};

export const likedAPI = {
  toggle: (song) => request('/liked/toggle', { method: 'POST', body: JSON.stringify(song) }),
  getAll: () => request('/liked'),
  check: (trackId) => request(`/liked/check/${trackId}`),
};

export const historyAPI = {
  add: (data) => request('/history', { method: 'POST', body: JSON.stringify(data) }),
  getAll: (page = 1, limit = 50) => request(`/history?page=${page}&limit=${limit}`),
  getRecent: (limit = 20) => request(`/history/recent?limit=${limit}`),
  getPlayCounts: () => request('/history/playcounts'),
  clear: () => request('/history', { method: 'DELETE' }),
};