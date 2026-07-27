import api from './api';

/**
 * Fetch all amenities from the backend.
 */
export const getAmenities = async () => {
  const response = await api.get('/amenities');
  // Backend returns the list directly in the response body, matching the older frontend.
  return response.data ?? [];
};
