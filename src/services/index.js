import APIService from './apiService';
import StorepassService from './storepassService';
import ShopifyService from './shopifyService';
import AuthService from './authService';

// Initialize services
export const apiService = new APIService();
export const storepassService = new StorepassService();
export const shopifyService = new ShopifyService();
export const authService = new AuthService();

export { APIService, StorepassService, ShopifyService, AuthService };