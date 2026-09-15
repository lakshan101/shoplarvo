const API_BASE = '/api/admin';

const safeParseJson = async (res) => {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : { success: false, message: 'Server returned empty response.' };
  } catch (err) {
    return { success: false, message: 'Server error or invalid response format. Please try again.' };
  }
};

export const getAdminStatsApi = async (token) => {
  const res = await fetch(`${API_BASE}/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await safeParseJson(res);
};

export const getEmployeesApi = async (token) => {
  const res = await fetch(`${API_BASE}/employees`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await safeParseJson(res);
};

export const createEmployeeApi = async (token, employeeData) => {
  const res = await fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(employeeData)
  });
  return await safeParseJson(res);
};

export const getCouponsApi = async (token) => {
  const res = await fetch(`${API_BASE}/coupons`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await safeParseJson(res);
};

export const createCouponApi = async (token, couponData) => {
  const res = await fetch(`${API_BASE}/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(couponData)
  });
  return await safeParseJson(res);
};
