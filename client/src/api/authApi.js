const API_BASE = '/api/auth';

const safeParseJson = async (res) => {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : { success: false, message: 'Server returned empty response.' };
  } catch (err) {
    return { success: false, message: 'Server error or invalid response format. Please try again.' };
  }
};

export const registerApi = async (userData) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await safeParseJson(res);
};

export const loginApi = async (credentials) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return await safeParseJson(res);
};

export const getProfileApi = async (token) => {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await safeParseJson(res);
};

export const updateProfileApi = async (token, profileData) => {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  return await safeParseJson(res);
};

export const addAddressApi = async (token, addressData) => {
  const res = await fetch(`${API_BASE}/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(addressData)
  });
  return await safeParseJson(res);
};

export const fetchCustomersApi = async (token) => {
  const res = await fetch(`${API_BASE}/customers`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await safeParseJson(res);
};
