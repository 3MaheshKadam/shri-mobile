import { Config } from '@/constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Centralized API utility for Shree Kalyanam mobile app
 * Backend: http://192.168.1.23:3006
 */

// Helper to get auth token
const getAuthToken = async () => {
    try {
        return await AsyncStorage.getItem('authToken');
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

// Helper for API requests
const apiRequest = async (endpoint, options = {}) => {
    try {
        const token = await getAuthToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token && !options.skipAuth) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const url = `${Config.API_URL}${endpoint}`;
        console.log(`API Request: ${options.method || 'GET'} ${url}`);

        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

// ==================== AUTHENTICATION ====================

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - 10-digit phone number without country code
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendOTP = async (phoneNumber) => {
    return apiRequest('/api/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber }),
        skipAuth: true,
    });
};

/**
 * Verify OTP and login/register user
 * @param {string} phoneNumber - 10-digit phone number
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<{success: boolean, userId: string, isNewUser: boolean, user: object}>}
 */
export const verifyOTP = async (phoneNumber, otp) => {
    return apiRequest('/api/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber, otp }),
        skipAuth: true,
    });
};

/**
 * Logout user
 * @returns {Promise<{success: boolean}>}
 */
export const logout = async () => {
    return apiRequest('/api/logout', {
        method: 'POST',
    });
};

// ==================== USERS ====================

/**
 * Fetch all users with filters and pagination
 * @param {object} filters - Filter options
 * @param {string} filters.gender - Gender filter
 * @param {number} filters.minAge - Minimum age
 * @param {number} filters.maxAge - Maximum age
 * @param {string} filters.city - City filter
 * @param {string} filters.caste - Caste filter
 * @param {string} filters.maritalStatus - Marital status
 * @param {string} filters.education - Education level
 * @param {string} filters.income - Income range
 * @param {number} filters.page - Page number (default: 1)
 * @param {number} filters.limit - Items per page (default: 20)
 * @returns {Promise<{success: boolean, data: array, pagination: object}>}
 */
export const fetchAllUsers = async (filters = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
            queryParams.append(key, filters[key]);
        }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/users/fetchAllUsers${queryString ? `?${queryString}` : ''}`;

    return apiRequest(endpoint, { method: 'GET' });
};

/**
 * Get current user profile
 * @returns {Promise<{success: boolean, user: object}>}
 */
export const getCurrentUser = async () => {
    return apiRequest('/api/users/me', { method: 'GET' });
};

/**
 * Update user profile
 * @param {object} userData - User data to update
 * @returns {Promise<{success: boolean, user: object}>}
 */
export const updateUserProfile = async (userData) => {
    return apiRequest('/api/users/update', {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

/**
 * Upload user photo
 * @param {object} photoData - Photo data with file
 * @returns {Promise<{success: boolean, url: string}>}
 */
export const uploadPhoto = async (photoData) => {
    const formData = new FormData();
    formData.append('file', photoData);

    const token = await getAuthToken();

    const response = await fetch(`${Config.API_URL}/api/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    return response.json();
};

/**
 * Update user photo (set primary, delete)
 * @param {object} photoData - Photo update data
 * @returns {Promise<{success: boolean}>}
 */
export const updatePhoto = async (photoData) => {
    return apiRequest('/api/users/photo', {
        method: 'PUT',
        body: JSON.stringify(photoData),
    });
};

/**
 * Update privacy settings
 * @param {object} privacySettings - Privacy settings
 * @returns {Promise<{success: boolean}>}
 */
export const updatePrivacySettings = async (privacySettings) => {
    return apiRequest('/api/users/privacy', {
        method: 'PUT',
        body: JSON.stringify(privacySettings),
    });
};

/**
 * Request profile verification
 * @returns {Promise<{success: boolean}>}
 */
export const requestVerification = async () => {
    return apiRequest('/api/users/verify-request', {
        method: 'POST',
    });
};

// ==================== INTERESTS ====================

/**
 * Send interest to another user
 * @param {string} receiverId - User ID to send interest to
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendInterest = async (receiverId) => {
    return apiRequest('/api/interest/send', {
        method: 'POST',
        body: JSON.stringify({ receiverId }),
    });
};

/**
 * Get received interests
 * @returns {Promise<{success: boolean, interests: array}>}
 */
export const getReceivedInterests = async () => {
    return apiRequest('/api/interest/received', { method: 'GET' });
};

/**
 * Get sent interests
 * @returns {Promise<{success: boolean, interests: array}>}
 */
export const getSentInterests = async () => {
    return apiRequest('/api/interest/sent', { method: 'GET' });
};

/**
 * Update interest status (accept/reject)
 * @param {string} interestId - Interest ID
 * @param {string} status - Status ('accepted' or 'rejected')
 * @returns {Promise<{success: boolean}>}
 */
export const updateInterestStatus = async (interestId, status) => {
    return apiRequest('/api/interest/status', {
        method: 'PUT',
        body: JSON.stringify({ interestId, status }),
    });
};

// ==================== SUBSCRIPTION & PAYMENT ====================

/**
 * Get subscription plans
 * @returns {Promise<{success: boolean, plans: array}>}
 */
export const getSubscriptionPlans = async () => {
    return apiRequest('/api/subscription', { method: 'GET' });
};

/**
 * Create Razorpay payment order
 * @param {string} planId - Subscription plan ID
 * @returns {Promise<{success: boolean, orderId: string, amount: number}>}
 */
export const createPaymentOrder = async (planId) => {
    return apiRequest('/api/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ planId }),
    });
};

/**
 * Update user subscription after successful payment
 * @param {object} paymentData - Payment verification data
 * @returns {Promise<{success: boolean}>}
 */
export const updateSubscription = async (paymentData) => {
    return apiRequest('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(paymentData),
    });
};

// ==================== ADMIN ====================

/**
 * Get admin dashboard stats
 * @returns {Promise<{success: boolean, stats: object}>}
 */
export const getAdminStats = async () => {
    return apiRequest('/api/admin/stats', { method: 'GET' });
};

/**
 * Get users for admin management
 * @param {object} filters - Filter options
 * @returns {Promise<{success: boolean, users: array}>}
 */
export const getAdminUsers = async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    return apiRequest(`/api/admin/users?${queryParams}`, { method: 'GET' });
};

/**
 * Verify user profile (admin)
 * @param {string} userId - User ID to verify
 * @param {string} status - Verification status
 * @returns {Promise<{success: boolean}>}
 */
export const verifyUserProfile = async (userId, status) => {
    return apiRequest('/api/admin/verify', {
        method: 'POST',
        body: JSON.stringify({ userId, status }),
    });
};

export default {
    // Auth
    sendOTP,
    verifyOTP,
    logout,

    // Users
    fetchAllUsers,
    getCurrentUser,
    updateUserProfile,
    uploadPhoto,
    updatePhoto,
    updatePrivacySettings,
    requestVerification,

    // Interests
    sendInterest,
    getReceivedInterests,
    getSentInterests,
    updateInterestStatus,

    // Subscription
    getSubscriptionPlans,
    createPaymentOrder,
    updateSubscription,

    // Admin
    getAdminStats,
    getAdminUsers,
    verifyUserProfile,
};
