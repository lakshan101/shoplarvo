const API_BASE = '/api/orders';

const safeParseJson = async (res) => {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : { success: false, message: 'Server returned empty response.' };
  } catch (err) {
    return { success: false, message: 'Server error or invalid response format. Please try again.' };
  }
};

export const createOrderApi = async (token, orderData) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData)
  });
  return await safeParseJson(res);
};

export const getMyOrdersApi = async (token) => {
  const headers = {};
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/my-orders`, { headers });
  return await safeParseJson(res);
};

export const getAllOrdersApi = async (token) => {
  const headers = {};
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(API_BASE, { headers });
  return await safeParseJson(res);
};

export const updateOrderStatusApi = async (token, orderId, status) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/${orderId}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status })
  });
  return await safeParseJson(res);
};
