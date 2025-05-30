import { apiClient } from './apiClient';

export const addTour = async (tourData) => {
  try {
    const response = await apiClient.post('/tour/add_tour', tourData);
    return response.data;
  } catch (error) {
    console.error('Add Tour error:', error.response.data.errors);
    throw error;
  }
};

export const getTours = async () => {
  try {
    const response = await apiClient.get('/tour/all_tours');
    return response.data;
  } catch (error) {
    console.error('Get Tours error:', error.response.data.errors);
    throw error;
  }
};

export const getTourById = async (tourId) => {
  try {
    const response = await apiClient.get(`/tour/get_tour/${tourId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Get Tour by ID (${tourId}) error:`,
      error.response.data.errors
    );
    throw error;
  }
};

export const editTour = async (tourId, tourData) => {
  try {
    const response = await apiClient.put(`/tour/edit_tour/${tourId}`, tourData);
    return response.data;
  } catch (error) {
    console.error(
      `Edit Tour error for ID (${tourId}):`,
      error.response.data.errors
    );
    throw error;
  }
};

export const deleteTour = async (tourId) => {
  try {
    const response = await apiClient.delete(`/tour/delete_tour/${tourId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Delete Tour error for ID (${tourId}):`,
      error.response.data.errors
    );
    throw error;
  }
};
