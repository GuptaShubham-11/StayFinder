import apiClient from './apiClient';

const getAllListings = async (params: any) => {
  try {
    const response = await apiClient.get('/listings/all-listings', { params });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const createListing = async (data: any) => {
  try {
    const response = await apiClient.post('/listings/create-listing', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);

    return response.data;
  } catch (error: any) {
    console.log(error);

    throw error.response.data;
  }
};

const getListingById = async (id: string) => {
  try {
    const response = await apiClient.get(`/listings/listing/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const getHostListings = async () => {
  try {
    const response = await apiClient.get('/listings/host-listings');
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const deleteListing = async (id: string) => {
  try {
    const response = await apiClient.delete(`/listings/delete-listing/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const updateListing = async (id: string, data: any) => {
  try {
    const response = await apiClient.put(
      `/listings/update-listing/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const listingApi = {
  getAllListings,
  getListingById,
  createListing,
  getHostListings,
  deleteListing,
  updateListing,
};
