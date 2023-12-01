import axios from 'axios';

const API_BASE_URL = 'https://141.94.76.170:5000/api';

const getAuthConfig = () => {
    const JWtoken = localStorage.getItem('JWToken');
    return JWtoken ? { headers: { 'Authorization': `Bearer ${JWtoken}` } } : {};
};

const sendRequest = async (method, endpoint, data = {}) => {
    try {
        const config = getAuthConfig();
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await axios({ method, url, data, ...config });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An error occurred');
    }
};

const sendRequestWithoutAuth = async (method, endpoint, data = {}) => {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await axios({ method, url, data });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An error occurred');
    }
};

const api = {
    /* Auth Methods */
    async register(user) {
        return sendRequestWithoutAuth('post', '/users/register', user);
    },

    async login(user) {
        return sendRequestWithoutAuth('post', '/users/login', user);
    },

    async logout() {
        return sendRequest('post', '/users/logout', {});
    },

    /* CRUD user */
    async createUser(user) {
        return sendRequest('post', '/users', user);
    },

    async getAllUsers() {
        return sendRequest('get', '/users');
    },

    async getUserById(userId) {
        return sendRequest('get', `/users/${userId}`);
    },
    
    async updateUser(userId, user) {
        return sendRequest('put', `/users/${userId}`, user);
    },

    async deleteUser(userId) {
        return sendRequest('delete', `/users/${userId}`);
    },

    async getUserRole() {
        return sendRequest('get', '/users/role');
    },

    /* Price History Methods */
    async addPriceHistory(priceHistory) {
        return sendRequest('post', '/priceHistory', priceHistory);
    },

    async getPriceHistoryForAllSiteByProduct() {
        return sendRequest('get', '/priceHistory/product');
    },

    async getPriceHistoryByProduct(productId, site) {
        const endpoint = `/priceHistory/product${productId}` + (site ? `?site=${site}` : '');
        return sendRequest('get', endpoint);
    },


    /* Product Methods */
    async addProduct(product) {
        return sendRequest('post', '/products', product);
    },

    async getAllProducts() {
        return sendRequest('get', '/products');
    },

    async getProductById(id) {
        return sendRequest('get', `/products/${id}`);
    },

    async updateProduct(id, product) {
        return sendRequest('put', `/products/${id}`, product);
    },

    async deleteProduct(id) {
        return sendRequest('delete', `/products/${id}`);
    },

    // ... ici, vous pouvez continuer avec d'autres méthodes si nécessaire
};

export default api;