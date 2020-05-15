import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const server = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api'
      : 'https://todo-app-server0.herokuapp.com/api',
});

server.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

server.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      await AsyncStorage.setItem('token', '');
    }

    // https://github.com/axios/axios/issues/41#issuecomment-386762576
    return Promise.reject(error);
  },
);

export default server;
