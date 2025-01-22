import axios from 'axios';
import type { FeedbackFormData } from '../types/feedback';

const API_URL = 'http://localhost:3000/api';

export const submitFeedback = async (feedback: FeedbackFormData) => {
  const response = await axios.post(`${API_URL}/feedback`, feedback);
  return response.data;
};

export const getFeedback = async (params: {
  page?: number;
  limit?: number;
  type?: string;
  sortBy?: string;
}) => {
  const response = await axios.get(`${API_URL}/feedback`, { params });
  return response.data;
};