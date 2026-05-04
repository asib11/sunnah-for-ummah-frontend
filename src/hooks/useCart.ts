import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";

const CART_KEY = "medusa_cart_id";

// Helper to get cart ID from local storage safely
const getLocalCartId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(CART_KEY);
  }
  return null;
};

// Helper to set cart ID in local storage safely
const setLocalCartId = (cartId: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, cartId);
  }
};

export function useCart() {
  const queryClient = useQueryClient();
  const cartId = getLocalCartId();

  // Query to fetch the cart details if we have an ID
  const {
    data: cart,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cart", cartId],
    queryFn: () => storeApi.getCart(cartId as string).then(res => res.cart),
    enabled: !!cartId,
  });

  // Mutation to create a new cart
  const createCartMutation = useMutation({
    mutationFn: storeApi.createCart,
    onSuccess: (data) => {
      setLocalCartId(data.cart.id);
      queryClient.setQueryData(["cart", data.cart.id], data.cart);
    },
  });

  // Mutation to add an item to the cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      let currentCartId = getLocalCartId();
      
      // If no cart exists, create one first
      if (!currentCartId) {
        const newCartData = await storeApi.createCart();
        currentCartId = newCartData.cart.id;
        setLocalCartId(currentCartId);
      }

      // Then add the item
      const response = await storeApi.addToCart(currentCartId, variantId, quantity);
      return response.cart;
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart", updatedCart.id], updatedCart);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Mutation to update item quantity
  const updateItemMutation = useMutation({
    mutationFn: async ({ lineId, quantity }: { lineId: string; quantity: number }) => {
      const currentCartId = getLocalCartId();
      if (!currentCartId) throw new Error("No cart found");
      
      const response = await storeApi.updateLineItem(currentCartId, lineId, quantity);
      return response.cart;
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart", updatedCart.id], updatedCart);
    },
  });

  // Mutation to remove an item
  const removeItemMutation = useMutation({
    mutationFn: async ({ lineId }: { lineId: string }) => {
      const currentCartId = getLocalCartId();
      if (!currentCartId) throw new Error("No cart found");
      
      const response = await storeApi.removeLineItem(currentCartId, lineId);
      // Wait, removeLineItem might return a generic ok response or the updated cart. 
      // Most Medusa v2 APIs return the parent object or a standard delete response.
      // Usually it's better to refetch if we don't get the full cart back.
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    },
  });

  // Calculate total items in the cart
  const totalItems = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  return {
    cart,
    isLoading,
    isError,
    totalItems,
    addToCart: addToCartMutation.mutate,
    isAdding: addToCartMutation.isPending,
    updateItem: updateItemMutation.mutate,
    isUpdating: updateItemMutation.isPending,
    removeItem: removeItemMutation.mutate,
    isRemoving: removeItemMutation.isPending,
    refetch,
  };
}
