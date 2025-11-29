export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiRoutes = {
    auth: {
        login: () => `${API_BASE_URL}/auth/login`,
        register: () => `${API_BASE_URL}/auth/register`,
        me: () => `${API_BASE_URL}/auth/me`, // Assuming we'll add this endpoint
        logout: () => `${API_BASE_URL}/auth/logout`,
    }
};
