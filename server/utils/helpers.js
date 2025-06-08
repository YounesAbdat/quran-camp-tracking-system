// Date formatting helpers
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Validation helpers
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[\+]?[1-9][\d]{0,15}$/;
  return regex.test(phone);
};

// Storage helpers
export const getFromStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage error:', error);
  }
};

// API response helpers
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || 'Server error occurred';
  } else if (error.request) {
    return 'Network error - please check your connection';
  } else {
    return 'An unexpected error occurred';
  }
};