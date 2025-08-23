export const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key) => {
  const value = localStorage.getItem(key);
  try {
    return value !== null ? JSON.parse(value) : null;
  } catch {
    return value;
  }
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
};
