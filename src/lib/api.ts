// src/lib/api.ts
const NEXT_PUBLIC_MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

// Ensure URL does not end with a slash for consistent path concatenation
const BASE_URL = NEXT_PUBLIC_MEDUSA_BACKEND_URL.endsWith("/")
  ? NEXT_PUBLIC_MEDUSA_BACKEND_URL.slice(0, -1)
  : NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export const authApi = {
  /**
   * Login user using email and password
   */
  async login(email: string, password: string) {
    const response = await fetch(`${BASE_URL}/auth/customer/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to login. Please check your credentials.");
    }

    return response.json();
  },

  /**
   * Register a new user
   */
  async register(data: { email: string; password: string; first_name?: string; last_name?: string; phone?: string }) {
    const response = await fetch(`${BASE_URL}/auth/customer/emailpass/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to register. Please try again.");
    }

    return response.json();
  },

  /**
   * Request password reset
   */
  async resetPassword(email: string) {
    const response = await fetch(`${BASE_URL}/auth/customer/emailpass/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to request password reset.");
    }

    return response.json();
  },

  /**
   * Logout user / delete session
   */
  async logout() {
    const response = await fetch(`${BASE_URL}/auth/session`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout.");
    }

    return response.json().catch(() => ({}));
  },
};
