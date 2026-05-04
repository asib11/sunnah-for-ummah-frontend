import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api";

export const useCustomer = () => {
  const { data: customer, isLoading, isError, refetch } = useQuery({
    queryKey: ["customer"],
    queryFn: () => authApi.getCurrentCustomer(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    customer,
    isLoading,
    isError,
    isAuthenticated: !!customer,
    refetch,
  };
};
