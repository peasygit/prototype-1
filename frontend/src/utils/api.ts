const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
console.log('API Base URL:', API_URL); // Debug log for deployment troubleshooting

interface RequestOptions extends RequestInit {
  token?: string;
}

export const api = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, headers, ...customConfig } = options;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      // Check for token in localStorage if running in browser
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          defaultHeaders['Authorization'] = `Bearer ${storedToken}`;
        }
      }
    }

    const config: RequestInit = {
      ...customConfig,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  },

  get<T>(endpoint: string, options: RequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body: any, options: RequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  },

  put<T>(endpoint: string, body: any, options: RequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  },

  delete<T>(endpoint: string, options: RequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
