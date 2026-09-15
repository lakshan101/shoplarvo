const API_BASE = '/api/orders';

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
  return await res.json();
};

export const getMyOrdersApi = async (token) => {
  const headers = {};
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/my-orders`, { headers });
  return await res.json();
};

export const getAllOrdersApi = async (token) => {
  const headers = {};
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(API_BASE, { headers });
  return await res.json();
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
  return await res.json();
};
