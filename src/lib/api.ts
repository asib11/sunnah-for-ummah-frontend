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
   * Get current authenticated customer
   */
  async getCurrentCustomer() {
    const response = await fetch(`${BASE_URL}/store/customers/me`, {
      method: "GET",
      headers: getDefaultHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.customer;
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

export const storeApi = {
  /**
   * Fetch product categories
   */
  async getCategories() {
    const response = await fetch(`${BASE_URL}/store/product-categories`, {
      method: "GET",
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch categories.");
    }

    return response.json();
  },

  /**
   * Fetch a category by its handle
   */
  async getCategoryByHandle(handle: string) {
    const response = await fetch(`${BASE_URL}/store/product-categories?handle=${handle}`, {
      method: "GET",
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch category.");
    }

    const data = await response.json();
    return data.product_categories && data.product_categories.length > 0 
      ? data.product_categories[0] 
      : null;
  },

  /**
   * Fetch products by category ID
   */
  async getProductsByCategory(categoryId: string) {
    const response = await fetch(`${BASE_URL}/store/products?category_id[]=${categoryId}&fields=id,title,subtitle,handle,thumbnail,metadata,*variants.prices&limit=100`, {
      method: "GET",
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch products.");
    }

    return response.json();
  },

  /**
   * Fetch all products (for home page / new arrivals)
   */
  async getProducts(limit = 100) {
    const response = await fetch(
      `${BASE_URL}/store/products?fields=id,title,subtitle,handle,thumbnail,metadata,*variants.prices&limit=${limit}`,
      { method: "GET", headers: getDefaultHeaders() }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch products.");
    }
    return response.json();
  },

  async getProductByHandle(handle: string) {
    const response = await fetch(
      `${BASE_URL}/store/products?handle=${handle}&fields=id,title,subtitle,handle,description,thumbnail,metadata,*variants.prices,*variants.options,*options`,
      { method: "GET", headers: getDefaultHeaders() }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch product.");
    }
    const data = await response.json();
    return data.products?.[0] || null;
  },

  /**
   * Fetch products by category HANDLE (not ID) so it survives category recreation
   */
  async getProductsByCategoryHandle(handle: string) {
    // Step 1: resolve handle → category ID
    const cat = await storeApi.getCategoryByHandle(handle);
    if (!cat?.id) throw new Error(`Category not found: ${handle}`);
    // Step 2: fetch products
    return storeApi.getProductsByCategory(cat.id);
  },
  /**
   * Fetch orders for the logged-in customer
   */
  async getCustomerOrders() {
    const response = await fetch(`${BASE_URL}/store/orders?fields=*items,*shipping_address,*summary`, {
      method: "GET",
      headers: getDefaultHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch orders.");
    }

    return response.json();
  },

  async getOrder(id: string) {
    const response = await fetch(`${BASE_URL}/store/orders/${id}?fields=*items,*shipping_address,*summary,*shipping_methods,*payment_collections,*payment_collections.payments`, {
      method: "GET",
      headers: getDefaultHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch order.");
    }

    return response.json();
  },

  // ==========================================
  // CART API
  // ==========================================

  async createCart() {
    const response = await fetch(`${BASE_URL}/store/carts`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create cart.");
    }

    return response.json();
  },

  async getCart(cartId: string) {
    const response = await fetch(`${BASE_URL}/store/carts/${cartId}`, {
      method: "GET",
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch cart.");
    }

    return response.json();
  },

  async addToCart(cartId: string, variantId: string, quantity: number) {
    const response = await fetch(`${BASE_URL}/store/carts/${cartId}/line-items`, {
      method: "POST",
      headers: getDefaultHeaders(),
      body: JSON.stringify({ variant_id: variantId, quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add item to cart.");
    }

    return response.json();
  },

  async updateLineItem(cartId: string, lineId: string, quantity: number) {
    const response = await fetch(`${BASE_URL}/store/carts/${cartId}/line-items/${lineId}`, {
      method: "POST",
      headers: getDefaultHeaders(),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update line item.");
    }

    return response.json();
  },

  async removeLineItem(cartId: string, lineId: string) {
    const response = await fetch(`${BASE_URL}/store/carts/${cartId}/line-items/${lineId}`, {
      method: "DELETE",
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to remove line item.");
    }

    return response.json();
  },

  async addCustomerToCart(cartId: string) {
    const response = await fetch(`${BASE_URL}/store/carts/${cartId}/customer`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include", // Essential to pick up the session cookie
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add customer to cart.");
    }

    return response.json();
  },

  async updateCart(cartId: string, data: any) {
    const response = await fetch(`${BASE_URL}/store/carts/${cartId}`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update cart.");
    }

    return response.json();
  },

  async getShippingMethods(cartId: string) {
    const response = await fetch(`${BASE_URL}/store/shipping-options?cart_id=${cartId}`, {
      method: "GET",
      headers: getDefaultHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch shipping methods.");
    }

    return response.json();
  },

  async addShippingMethod(cartId: string, optionId: string) {
    const response = await fetch(`${BASE_URL}/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
      body: JSON.stringify({ option_id: optionId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add shipping method.");
    }

    return response.json();
  },

  async createPaymentCollection(cartId: string) {
    // Step 1: Create payment collection with cart_id in the body
    const collectionRes = await fetch(`${BASE_URL}/store/payment-collections`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
      body: JSON.stringify({ cart_id: cartId }),
    });

    if (!collectionRes.ok) {
      const errorData = await collectionRes.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create payment collection.");
    }

    const collectionData = await collectionRes.json();
    const paymentCollectionId = collectionData.payment_collection?.id;

    if (!paymentCollectionId) {
      throw new Error("Payment collection ID not found.");
    }

    // Step 2: Initialize a payment session with the system default provider
    const sessionRes = await fetch(`${BASE_URL}/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
      body: JSON.stringify({ provider_id: "pp_system_default" }),
    });

    if (!sessionRes.ok) {
      const errorData = await sessionRes.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create payment session.");
    }

    return sessionRes.json();
  },

  async completeCart(cartId: string) {
    const response = await fetch(`${BASE_URL}/store/carts/${cartId}/complete`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to complete cart.");
    }

    return response.json();
  },
};
