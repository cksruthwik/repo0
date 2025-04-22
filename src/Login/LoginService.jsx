// src/services/authService.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Send OTP request to user's email
 * @param {Object} data - Contains email
 * @throws {Error} on non-2xx, with backend message if available
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function sendOtp({ email }) {
  const res = await fetch(`${API_BASE}/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || 'Failed to send OTP');
  }

  return payload;
}

/**
 * Verify OTP and login
 * @param {string} email
 * @param {string} otp
 * @throws {Error} on non‑2xx, with backend message if available
 * @returns {Promise<{ accessToken: string, user?: object }>}
 */
export async function login(email, otp) {
  const res = await fetch(`${API_BASE}/verify-otp`, {
    method: 'POST',
    credentials: 'include',          // important for cookie
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || 'Login failed');
  }

  return payload;
}

/**
 * Refresh the access token using the refresh token cookie
 * @throws {Error} on non-2xx
 * @returns {Promise<{ accessToken: string }>}
 */
export async function refresh() {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',  
    credentials: 'include'
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error('Refresh failed');
  return data;    // { accessToken }
}