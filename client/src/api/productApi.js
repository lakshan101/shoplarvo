const API_BASE = '/api/products';

const safeParseJson = async (res) => {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : { success: false, message: 'Server returned empty response.' };
  } catch (err) {
    return { success: false, message: 'Server error or invalid response format. Please try again.' };
  }
};

export const fetchProductsApi = async () => {
  const res = await fetch(API_BASE);
  return await safeParseJson(res);
};

export const createProductApi = async (token, productData) => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  return await safeParseJson(res);
};

export const updateProductApi = async (token, id, productData) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  return await safeParseJson(res);
};

export const deleteProductApi = async (token, id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await safeParseJson(res);
};
