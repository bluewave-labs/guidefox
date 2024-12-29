import { apiClient } from './apiClient';

export const addPopup = async (popupData) => {
  try {
    const response = await apiClient.post('/popup/add_popup', popupData);
    return response.data;
  } catch (error) {
    console.error('Add Popup error:', error.response);
    throw error;
  }
};

export const getPopups = async () => {
  try {
    const response = await apiClient.get('/popup/all_popups');
    return response.data;
  } catch (error) {
    console.error('Get Popups error:', error);
    throw error;
  }
};

export const getPopupById = async (popupId) => {
  try {
    const response = await apiClient.get(`/popup/get_popup/${popupId}`);
    return response.data;
  } catch (error) {
    console.error(`Get Popup by ID (${popupId}) error:`, error);
    throw error;
  }
};

export const editPopup = async (popupId, popupData) => {
  try {
    const response = await apiClient.put(`/popup/edit_popup/${popupId}`, popupData);
    return response.data;
  } catch (error) {
    console.error(`Edit Popup error for ID (${popupId}):`, error);
    throw error;
  }
};

export const deletePopup = async (popupId) => {
  try {
    const response = await apiClient.delete(`/popup/delete_popup/${popupId}`);
    return response.data;
  } catch (error) {
    console.error(`Delete Popup error for ID (${popupId}):`, error);
    throw error;
  }
};
