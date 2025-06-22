import apiClient from './apiClient';

const addToWishlist = async (listingId: string) => {
  try {
    const response = await apiClient.post(
      `/wishlists/add-wishlist/${listingId}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const removeFromWishlist = async (listingId: string) => {
  try {
    const response = await apiClient.delete(
      `/wishlists/remove-wishlist/${listingId}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const getUserWishlist = async () => {
  try {
    const response = await apiClient.get('/wishlists/get-wishlist');
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const wishlistApi = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
};
