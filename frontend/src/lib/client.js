// The one place that talks to the backend: base url, login token, errors.
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Where the backend runs. Order:
//  1. EXPO_PUBLIC_API_URL from frontend/.env   (use this on a real phone: http://<your-pc-ip>:5000/api)
//  2. the same computer that serves the Expo app (works for Expo Go on the same Wi-Fi)
//  3. the emulator defaults
function defaultBase() {
  const hostUri = Constants.expoConfig && Constants.expoConfig.hostUri;
  if (hostUri) return 'http://' + hostUri.split(':')[0] + ':5000/api';
  return Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';
}

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || defaultBase()).replace(/\/$/, '');

let token = null; // kept in memory only: closing the app means logging in again
let onUnauthorized = null;

export const setToken = (t) => {
  token = t;
};
export const hasToken = () => token !== null;
// called when the server says the login is no longer valid (expired, logged out elsewhere)
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function request(method, path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  const sentToken = token;

  let response;
  try {
    response = await fetch(API_URL + path, {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(sentToken ? { Authorization: 'Bearer ' + sentToken } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    throw new ApiError(0, 'Cannot reach the server. Is the backend running?');
  } finally {
    clearTimeout(timer);
  }

  let json = null;
  try {
    json = await response.json();
  } catch (e) {
    // no body
  }

  if (!response.ok) {
    if (response.status === 401 && sentToken && token === sentToken && onUnauthorized) {
      onUnauthorized();
    }
    throw new ApiError(response.status, (json && json.error) || 'Something went wrong');
  }
  return json;
}
