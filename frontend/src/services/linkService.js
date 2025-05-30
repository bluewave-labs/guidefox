import { apiClient } from './apiClient';
const RELATIVE_URL_REGEX = /^([./?#]|[a-zA-Z0-9_-]+\/?)+$/;

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return RELATIVE_URL_REGEX.test(url);
  }
};

export const createLink = async (link) => {
  try {
    if (!link.title?.trim() || !link.url?.trim()) {
      throw new Error('Title and URL are required');
    }
    if (!isValidUrl(link.url)) {
      throw new Error('Invalid URL format');
    }
    const response = await apiClient.post(`/link/add_link`, {
      title: link.title,
      url: link.url,
      order: link.order,
      target: link.target ? '_blank' : '_self',
      helperId: link.helperId,
    });
    if (response.status >= 400) throw new Error(response.data);
    return response.data;
  } catch (error) {
    console.error('Create Link error:', error.response);
    throw error;
  }
};

export const getLinks = async (helperId) => {
  try {
    if (!helperId) {
      throw new Error('Helper ID is required');
    }
    const response = await apiClient.get(
      `/link/get_links?helperId=${helperId}`
    );
    if (response.status >= 400) throw new Error(response.data);
    return response.data;
  } catch (error) {
    console.error('Get Link error:', error.response);
    throw error;
  }
};

export const getLinkById = async (id) => {
  try {
    if (!id) {
      throw new Error('Link ID is required');
    }
    const response = await apiClient.get(`/link/get_link/${id}`);
    return response.data;
  } catch (error) {
    if (error.message.includes('Link ID is required')) {
      throw error;
    }
    return false;
  }
};

export const updateLink = async (link) => {
  try {
    if (!link.title?.trim() || !link.url?.trim()) {
      throw new Error('Title and URL are required');
    }
    if (!isValidUrl(link.url)) {
      throw new Error('Invalid URL format');
    }
    if (typeof link.order !== 'number') {
      throw new Error('Order must be a number');
    }
    link.title = link.title.replace(/[<>]/g, '');
    const response = await apiClient.put(`/link/edit_link/${link.id}`, {
      title: link.title,
      url: link.url,
      order: link.order,
      target: link.target ? '_blank' : '_self',
      helperId: link.helperId,
    });
    if (response.status >= 400) throw new Error(response.data);
    return response.data;
  } catch (error) {
    console.error('Update Link error:', error.response);
    throw error;
  }
};

export const deleteLink = async (id) => {
  try {
    const response = await apiClient.delete(`/link/delete_link/${id}`);
    if (response.status >= 400) throw new Error(response.data);
    return response.data;
  } catch (error) {
    console.error('Delete Link error:', error.response);
    throw error;
  }
};
