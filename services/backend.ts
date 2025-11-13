import { Product, Review, User, UserType, Order, ShippingDetails, CartItem } from '../types';

const sanitizeUrl = (url: string) => {
    if (!url) return url;
    const trimmed = url.trim();
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

const DEFAULT_API_BASE_URL = import.meta.env.PROD
    ? 'https://peacock-backend-service-806651932334.europe-west1.run.app/api'
    : 'http://localhost:8080/api';
const API_BASE_URL = sanitizeUrl(import.meta.env?.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL);

if (!API_BASE_URL) {
    throw new Error('Backend URL has not been configured. Set VITE_API_BASE_URL in your environment or update services/backend.ts');
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    // For successful responses with no content (e.g., DELETE returning 204).
    if (response.status === 204) {
        return null as T;
    }

    // Read the body as text ONCE. This is safe and prevents the "body already read" error.
    const text = await response.text();

    if (!response.ok) {
        let errorMessage;
        try {
            // Try to parse the text as a structured JSON error.
            const errorJson = JSON.parse(text);
            errorMessage = errorJson.message;
        } catch (e) {
            // If parsing fails, the raw text itself is the error message.
            errorMessage = text;
        }
        throw new Error(errorMessage || `Request failed with status ${response.status}`);
    }

    // For successful responses, parse the text. An empty body will return null.
    return text ? JSON.parse(text) : null;
};


const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        return handleResponse<T>(response);
    },
    post: async <T>(endpoint: string, body: any): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return handleResponse<T>(response);
    },
    put: async <T>(endpoint: string, body: any): Promise<T> => {
         const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return handleResponse<T>(response);
    },
    delete: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
        });
        return handleResponse<T>(response);
    }
};

class BackendService {
    // --- User Management ---
    async signupUser(user: Omit<User, 'phoneNumber'>, userType: UserType): Promise<{ success: boolean; message: string }> {
        return api.post('/signup', { user, userType });
    }

    async loginUser(email: string, password: string, userType: UserType): Promise<{ success: boolean; user?: User; message?: string }> {
        return api.post('/login', { email, password, userType });
    }

    async updateUser(email: string, updatedDetails: Partial<Omit<User, 'password' | 'email'>>): Promise<User | null> {
        return api.put(`/users/${encodeURIComponent(email)}`, updatedDetails);
    }

    async changePassword(email: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        return api.post('/change-password', { email, currentPassword, newPassword });
    }

    // --- Product Management ---
    async getProducts(): Promise<Product[]> {
        return api.get<Product[]>('/products');
    }

    async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
        return api.post<Product>('/products', productData);
    }

    async updateProduct(updatedProduct: Product): Promise<Product | null> {
        return api.put<Product>(`/products/${updatedProduct.id}`, updatedProduct);
    }

    async deleteProduct(productId: number): Promise<boolean> {
        const result = await api.delete<{ success: boolean }>(`/products/${productId}`);
        return result ? result.success : true;
    }

    // --- Review Management ---
    async getReviews(): Promise<Review[]> {
        return api.get<Review[]>('/reviews');
    }

    async addReview(reviewData: Omit<Review, 'id'>): Promise<Review> {
        return api.post<Review>('/reviews', reviewData);
    }

    // --- Order Management ---
    async addOrder(userEmail: string, items: CartItem[], total: number, shippingDetails: ShippingDetails): Promise<Order> {
        return api.post<Order>('/orders', { userEmail, items, total, shippingDetails });
    }

    async getOrdersForUser(userEmail: string): Promise<Order[]> {
        return api.get<Order[]>(`/orders/${encodeURIComponent(userEmail)}`);
    }
}

export const backend = new BackendService();
