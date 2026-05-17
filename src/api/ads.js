import API from './axios';

export const getPopupAd = () => API.get('/ads/popup/');
export const getBannerAds = () => API.get('/ads/banners/');