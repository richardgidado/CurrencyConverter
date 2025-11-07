import { useQuery } from '@tanstack/react-query';
import { getExchangeRates } from '@/lib/api';

export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['exchangeRates'],
    queryFn: getExchangeRates,
    refetchInterval: 60000, // Refetch every 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2, // Consider data stale after 2 minutes
  });
};