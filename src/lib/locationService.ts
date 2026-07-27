import api from './api';

/**
 * Fetch all cities from the backend.
 * Returns an array of city objects (as provided by the API).
 */
export const getCities = async () => {
  const response = await api.get('/locations/cities');
  // Backend returns the list directly, matching the older frontend implementation.
  return response.data ?? [];
};

/**
 * Fetch districts for a given city ID.
 * @param cityId - The ID of the city.
 */
export const getDistricts = async (cityId: string) => {
  const response = await api.get(`/locations/cities/${cityId}/districts`);
  return response.data ?? [];
};
