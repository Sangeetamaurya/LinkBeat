// Rules for usernames and passwords (the same rules the backend uses).
export function usernameError(username) {
  const u = username.trim();
  if (u.length < 3) return 'Username needs at least 3 characters';
  if (u.length > 30) return 'Username can be 30 characters at most';
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return 'Use only letters, numbers and underscores';
  return '';
}

export function passwordError(password) {
  if (password.length < 6) return 'Password needs at least 6 characters';
  return '';
}
