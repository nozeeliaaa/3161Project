const TOKEN_KEY = "cms_token";
const USER_KEY = "cms_user";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser() {
  const value = localStorage.getItem(USER_KEY);
  return value ? JSON.parse(value) : null;
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
