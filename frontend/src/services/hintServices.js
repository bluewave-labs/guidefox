import { apiClient } from './apiClient';

export const addHint = async (hintData) => {
  try {
    const response = await apiClient.post('/hint/add_hint', hintData);
    return response.data;
  } catch (error) {
    console.error('Add hint error: ', error);
    throw error;
  }
};

export const editHint = async (hintId, hintData) => {
  try {
    const response = await apiClient.put(`/hint/edit_hint/${hintId}`, hintData);
    return response.data;
  } catch (error) {
    console.error(`Edit hint error for ID (${hintId}): `, error);
    throw error;
  }
};

export const deleteHint = async (hintId) => {
  try {
    const response = await apiClient.delete(`hint/delete_hint/${hintId}`);
    return response.data;
  } catch (error) {
    console.error(`Delete hint error for ID (${hintId}): `, error);
    throw error;
  }
};

export const getHints = async () => {
  try {
    const response = await apiClient.get('/hint/all_hints');
    return response.data;
  } catch (error) {
    console.error('Get hints error: ', error);
    throw error;
  }
};

export const getHintById = async (hintId) => {
  try {
    const response = await apiClient.get(`/hint/get_hint/${hintId}`);
    return response.data;
  } catch (error) {
    console.error(`Get hint by ID (${hintId}) error: `, error);
    throw error;
  }
};
