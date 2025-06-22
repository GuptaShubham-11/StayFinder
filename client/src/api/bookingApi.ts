import apiClient from './apiClient';

const createBooking = async (data: any) => {
  try {
    const response = await apiClient.post('/bookings/create-booking', data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const getBookingsByListing = async (id: string) => {
  try {
    const response = await apiClient.get(`/bookings/get-bookings/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const getUserBookings = async () => {
  try {
    const response = await apiClient.get('/bookings/user-bookings');
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const bookingApi = {
  getBookingsByListing,
  getUserBookings,
  createBooking,
};
