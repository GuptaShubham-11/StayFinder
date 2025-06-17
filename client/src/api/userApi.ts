import type { SignupInput } from '@/schemas/signupValidation';
import type { SigninInput } from '@/schemas/singinValidation';
import apiClient from './apiClient';

const signUp = async (data: SignupInput) => {
  try {
    const response = await apiClient.post('/users/signup', data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const signIn = async (data: SigninInput) => {
  try {
    const response = await apiClient.post('/users/signin', data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const signOut = async () => {
  try {
    const response = await apiClient.post('/users/signout');
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/current-user');
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const userApi = {
  getCurrentUser,
  signOut,
  signUp,
  signIn,
};
