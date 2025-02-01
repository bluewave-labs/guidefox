import { apiClient } from './apiClient';

export const updateUser = async (userDetails) => {
  try {
    const response = await apiClient.put('/users/update', userDetails);
    return response;
  } catch (error) {
    console.error('Error updating profile: ', error.message);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await apiClient.get('/users/current-user');
    return response;
  } catch (error) {
    console.error('Error fetching profile: ', error.message);
    throw error;
  }
};

export const getOrgDetails = async () => {
  try {
    const response = await apiClient.get('/team/details');
    return response;
  } catch (error) {
    console.error('Error getting details: ', error.message);
    throw error;
  }
};

export const updateTeamDetails = async (orgName) => {
  try {
    const response = await apiClient.put('/team/update', { name: orgName });
    return response;
  } catch (error) {
    console.error('Error updating organisation: ', error.message);
    throw error;
  }
};

export const removeTeamMember = async (memberId) => {
  try {
    const response = await apiClient.delete(`/team/remove/${memberId}`);
    return response;
  } catch (error) {
    console.error('Error removing member: ', error.message);
    throw error;
  }
};

export const inviteMember = async (inputs) => {
  try {
    const response = await apiClient.post('team/invite', {
      invitedEmail: inputs.email,
      role: inputs.role,
    });
    return response;
  } catch (error) {
    console.error('Error inviting member: ', error.message);
    throw error;
  }
};

export const changeMemberRole = async (inputs) => {
  try {
    const response = await apiClient.put('/team/change-role', {
      memberId: inputs.id,
      role: inputs.newRole,
    });
    return response;
  } catch (error) {
    console.error('Error changing role: ', error.message);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await apiClient.delete('/users/delete');
    return response;
  } catch (error) {
    console.error('Error deleteing accont: ', error.message);
    throw error;
  }
};
