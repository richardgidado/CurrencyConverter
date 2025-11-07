import { useQuery } from '@tanstack/react-query';
import { getCryptoPrices } from '@/lib/api';

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: getCryptoPrices,
    refetchInterval: 60000, // Refetch every 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2, // Consider data stale after 2 minutes
  });
};