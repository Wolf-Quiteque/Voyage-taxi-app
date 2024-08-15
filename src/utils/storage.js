import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Replace with your actual API base URL
const API_BASE_URL = 'https://webhostapi.vercel.app/voyage/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const saveUserInfo = async (userInfo) => {
  try {
    // Save to API
    const response = await api.post('/users', userInfo);
    
    // If API call is successful, also save to local storage
    if (response.status === 200 || response.status === 201) {
      const jsonValue = JSON.stringify(userInfo);
      await AsyncStorage.setItem('@user_info', jsonValue);
      return true;
    } else {
      console.error('Error saving user info to API:', response.status);
      return false;
    }
  } catch (e) {
    console.error('Error saving user info:', e);
    return false;
  }
};

export const getUserInfo = async () => {
  try {
    // Try to get from local storage first
    const jsonValue = await AsyncStorage.getItem('@user_info');
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    
    // If not in local storage, fetch from API
    const response = await api.get('/users/me');
    if (response.status === 200) {
      const userInfo = response.data;
      // Save to local storage for future use
      await AsyncStorage.setItem('@user_info', JSON.stringify(userInfo));
      return userInfo;
    } else {
      console.error('Error fetching user info from API:', response.status);
      return null;
    }
  } catch (e) {
    console.error('Error getting user info:', e);
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    if (response.status === 200) {
      // Assuming the API returns a token
      const { token, user } = response.data;
      // Save token to AsyncStorage
      await AsyncStorage.setItem('@auth_token', token);
      // Save user info to AsyncStorage
      await AsyncStorage.setItem('@user_info', JSON.stringify(user));
      return true;
    } else {
      console.error('Login failed:', response.status);
      return false;
    }
  } catch (e) {
    console.error('Error during login:', e);
    return false;
  }
};

export const logoutUser = async () => {
  try {
    // Clear local storage
    await AsyncStorage.multiRemove(['@auth_token', '@user_info']);
    // You might also want to call a logout endpoint on your API here
    return true;
  } catch (e) {
    console.error('Error during logout:', e);
    return false;
  }
};

// Add this interceptor to include the auth token in all requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;;
  },
  (error) => {
    return Promise.reject(error);
  }
);