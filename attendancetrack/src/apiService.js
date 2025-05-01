import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.121.239:3000'; // Update with your server IP

// Get stored authentication token
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

// Create an axios instance with configuration
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const fetchProjects = () => {
  return api.get('/api/projects');
};

export const getProjectDetails = (id) => {
  return api.get(`/api/projects/${id}`);
};

export const checkRegistrationStatus = (studentId) => {
  return api.get(`/api/projects/registration/${studentId}`);
};

export const registerTeam = (projectId, teamName, teamLead, members) => {
  return api.post('/api/projects/register', {
    projectId,
    teamName,
    teamLead,
    members
  });
};