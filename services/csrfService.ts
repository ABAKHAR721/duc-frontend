import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? "" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");

class CsrfService {
  private csrfToken: string | null = null;
  private tokenExpiry: number = 0;

  async getCsrfToken(): Promise<string> {
    // Check if we have a valid token that hasn't expired
    if (this.csrfToken && Date.now() < this.tokenExpiry) {
      return this.csrfToken;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/csrf/token`);
      this.csrfToken = response.data.csrfToken;
      // Set expiry to 50 minutes (tokens expire in 1 hour, we refresh early)
      this.tokenExpiry = Date.now() + (50 * 60 * 1000);
      return this.csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      throw error;
    }
  }

  clearToken(): void {
    this.csrfToken = null;
    this.tokenExpiry = 0;
  }

  async refreshToken(): Promise<string> {
    this.clearToken();
    return this.getCsrfToken();
  }
}

export const csrfService = new CsrfService();
