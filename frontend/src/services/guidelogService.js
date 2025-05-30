import { apiClient } from './apiClient';

export const getAllGuideLogs = async () => {
  try {
    const response = await apiClient.get('/guide_log/all_guide_logs');
    return response.data;
  } catch (error) {
    console.error('Get Guide Logs error:', error.response.data.errors);
    throw error;
  }
};

export const addGuideLog = async (logData) => {
  try {
    const response = await apiClient.post('/guide_log/add_guide_log', logData);
    return response.data;
  } catch (error) {
    console.error('Add Guide Logs error:', error.response.data.errors);
    throw error;
  }
};
