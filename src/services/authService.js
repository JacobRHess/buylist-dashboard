import APIService from './apiService';

class AuthService extends APIService {
  async login(username, password) {
    try {
      // TODO: Replace with real authentication
      // const response = await this.request('/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ username, password })
      // });
      
      // Mock authentication
      const mockUser = {
        id: 1,
        username: username,
        name: 'John Doe',
        role: 'staff',
        permissions: ['view_buylists', 'edit_buylists', 'process_payments']
      };
      
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      return mockUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
}

export default AuthService;