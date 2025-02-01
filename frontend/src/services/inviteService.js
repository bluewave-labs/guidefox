import { roles } from '../utils/constants';
import { apiClient } from './apiClient';

const baseEndpoint = 'team/';

export const sendInvites = async (memberEmails) => {
  if (!memberEmails?.length) {
    throw new Error('No email addresses provided');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = memberEmails.filter((email) => !emailRegex.test(email));
  if (invalidEmails.length) {
    throw new Error(`Invalid email addresses: ${invalidEmails.join(', ')}`);
  }

  try {
    const response = await Promise.all(
      memberEmails.map(async (email) => {
        const response = await apiClient.post(`${baseEndpoint}/invite`, {
          invitedEmail: email,
          role: roles[1],
        });
        return response.data;
      })
    );
    return response;
  } catch (err) {
    console.error('Error sending invites: ', err.response);
    throw err;
  }
};
