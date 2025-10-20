import { useQuery } from '@tanstack/react-query';
import { getAtacks } from '../api/attacksService.js';
import { toast } from 'react-toastify';

export const useAttacks = (range) => {
  return useQuery({
    queryKey: ['attacks', range], // ✅ hace refetch al cambiar el rango
    queryFn: () => getAtacks(range),
    onSuccess: (data) => {
      toast.success(data.message || 'Attacks fetched successfully');
    },
    onError: (error) => {
      toast.error(`Error fetching attacks: ${error.message}`);
    },
  });
};
