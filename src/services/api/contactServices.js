import api from './api';

export const createContactApi = async (payload) => {
  const res = await api.post('/api/v1/contact', payload);
  return res.data;
};