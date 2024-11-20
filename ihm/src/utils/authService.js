// src/utils/authService.js
export const authService = {
    validateEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  
    validatePhone: (phone) => {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      return phoneRegex.test(phone);
    },
  
    async signup(userData) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        return await response.json();
      } catch (error) {
        throw new Error('Signup failed');
      }
    },
  
    async login(credentials) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
      } catch (error) {
        throw new Error('Login failed');
      }
    },
  
    logout() {
      localStorage.removeItem('user');
      window.location.href = '/connexion';
    }
  };