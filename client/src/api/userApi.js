const API_BASE = '/api/admin';

const safeParseJson = async (res) => {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : { success: false, message: 'Server returned empty response.' };
  } catch (err) {
    return { success: false, message: 'Server error or invalid response format. Please try again.' };
  }
};

export const getUsersApi = async (token, { page = 1, limit = 10, search = '', role = '' } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (search) params.set('search', search);
  if (role) params.set('role', role);

  const res = await fetch(`${API_BASE}/users?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await safeParseJson(res);
};

export const toggleUserStatusApi = async (token, userId, isActive) => {
  const res = await fetch(`${API_BASE}/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ isActive })
  });
  return await safeParseJson(res);
};
