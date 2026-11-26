// Every backend call the app makes, in one list.
import { request } from './client';
import { localDateKey } from './format';

export const authApi = {
  signup: (name, username, password) => request('POST', '/auth/signup', { name, username, password }),
  login: (username, password) => request('POST', '/auth/login', { username, password }),
  logout: () => request('POST', '/auth/logout', {}),
  changePassword: (oldPassword, newPassword) =>
    request('POST', '/auth/change-password', { oldPassword, newPassword }),
  deleteAccount: () => request('DELETE', '/auth/account'),
  usernameAvailable: (username) =>
    request('GET', '/auth/username-available?username=' + encodeURIComponent(username)),
};

export const profileApi = {
  save: (data) => request('PUT', '/profile', data),
  saveAvatar: (avatar) => request('PUT', '/profile/avatar', { avatar }),
};

export const meApi = {
  // everything the app needs right after login
  state: () => request('GET', '/me/state?today=' + localDateKey()),
  stats: () => request('GET', '/stats/profile?today=' + localDateKey()),
};

export const songsApi = {
  search: (q, limit) =>
    request('GET', '/songs/search?q=' + encodeURIComponent(q) + '&limit=' + limit).then((r) => r.songs),
  mix: (terms, limit) =>
    request(
      'GET',
      '/songs/mix?terms=' + terms.map(encodeURIComponent).join(',') + '&limit=' + limit
    ).then((r) => r.songs),
  suggest: (prefix) =>
    request('GET', '/songs/suggest?prefix=' + encodeURIComponent(prefix)).then((r) => r.suggestions),
};
