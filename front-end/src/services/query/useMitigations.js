import { useQuery } from '@tanstack/react-query';
import { getMitigaciones } from '../api/mitigationService.js';
import { toast } from 'react-toastify';

export const useMitigaciones = (page = 1, limit = 10, filters = {}) => {
    return useQuery({
        queryKey: ['mitigaciones', page, limit, filters],
        queryFn: () => getMitigaciones({ page, limit, ...filters }),
        keepPreviousData: true,
        onSuccess: (res) => {
            toast.success(res.message || 'Mitigaciones cargadas correctamente');
        },
        onError: (error) => {
            toast.error(error.message || 'Error al cargar mitigaciones');
        },
    });
};
