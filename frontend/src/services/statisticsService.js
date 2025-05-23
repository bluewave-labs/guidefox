import { emitToastError } from '../utils/guideHelper';
import { apiClient } from './apiClient';

const getStatistics = async () => {
  try {
    const response = await apiClient.get(`/statistics/`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.errors?.[0]?.msg || error.message;
    emitToastError({
      response: { data: { errors: [{ msg: errorMessage }] } },
    });
    return null;
  }
};

export { getStatistics };
