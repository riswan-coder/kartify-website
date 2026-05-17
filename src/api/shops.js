import API from './axios';

export const getShops = (params) => API.get('/shops/', { params });
export const getShopDetail = (id) => API.get(`/shops/${id}/`);