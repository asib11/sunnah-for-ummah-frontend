// src/lib/api.ts
const NEXT_PUBLIC_MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

// Ensure URL does not end with a slash for consistent path concatenation
const BASE_URL = NEXT_PUBLIC_MEDUSA_BACKEND_URL.endsWith("/")
  ? NEXT_PUBLIC_MEDUSA_BACKEND_URL.slice(0, -1)
  : NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  }
  return headers;
};

export const authApi = {
  /**
   * Login user using email and password
   */
  async login(email: string, password: string) {
    const response = await fetch(`${BASE_URL}/auth/customer/emailpass`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to login. Please check your credentials.");
    }

    const authData = await response.json();
    
    // Create the session cookie
    if (authData.token) {
      await fetch(`${BASE_URL}/auth/session`, {
        method: "POST",
        headers: {
          ...getDefaultHeaders(),
          Authorization: `Bearer ${authData.token}`,
        },
        credentials: "include",
      });
    }

    return authData;
  },

  /**
   * Register a new user
   */
  async register(reqData: { email: string; password: string; first_name?: string; last_name?: string; phone?: string }) {
    // Step 1: Register auth identity
    const response = await fetch(`${BASE_URL}/auth/customer/emailpass/register`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
      body: JSON.stringify({ email: reqData.email, password: reqData.password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to register. Please try again.");
    }

    const authData = await response.json();

    if (authData.token) {
      // Step 2: Establish the session cookie
      await fetch(`${BASE_URL}/auth/session`, {
        method: "POST",
        headers: {
          ...getDefaultHeaders(),
          Authorization: `Bearer ${authData.token}`,
        },
        credentials: "include",
      });

      // Step 3: Create the customer profile linked to the auth identity
      const customerRes = await fetch(`${BASE_URL}/store/customers`, {
        method: "POST",
        headers: {
          ...getDefaultHeaders(),
          Authorization: `Bearer ${authData.token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          email: reqData.email,
          first_name: reqData.first_name,
          last_name: reqData.last_name,
          phone: reqData.phone,
        }),
      });

      if (!customerRes.ok) {
        const errorData = await customerRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create customer profile.");
      }
    }

    return authData;
  },

  /**
   * Request password reset
   */
  async resetPassword(email: string) {
    const response = await fetch(`${BASE_URL}/auth/customer/emailpass/reset-password`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
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
      headers: getDefaultHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to logout.");
    }

    return response.json().catch(() => ({}));
  },

  /**
   * Get current logged-in customer profile
   */
  async getCustomer() {
    const response = await fetch(`${BASE_URL}/store/customers/me`, {
      method: "GET",
      headers: getDefaultHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Not logged in");
    }

    return response.json();
  },

  /**
   * Update current logged-in customer profile
   */
  async updateCustomer(data: { first_name?: string; last_name?: string; phone?: string; password?: string }) {
    const response = await fetch(`${BASE_URL}/store/customers/me`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update profile.");
    }

    return response.json();
  },
};
