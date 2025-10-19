import { useState, useEffect } from 'react';
import attacksService from '../../../services/attacksService';

export const useAttacks = (initialParams = {}) => {
    const [attacks, setAttacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0
    });
    const [params, setParams] = useState(initialParams);

    useEffect(() => {
        const fetchAttacks = async () => {
            try {
                setLoading(true);
                const queryParams = {
                    page: pagination.page,
                    limit: pagination.limit,
                    ...params
                };
                
                const response = await attacksService.getAttacks(queryParams);
                
                setAttacks(response.results || []);
                setPagination({
                    ...pagination,
                    totalItems: response.count || 0,
                    totalPages: Math.ceil((response.count || 0) / pagination.limit)
                });
            } catch (err) {
                console.error('Error al cargar ataques:', err);
                setError('No se pudieron cargar los ataques');
            } finally {
                setLoading(false);
            }
        };

        fetchAttacks();
    }, [pagination.page, pagination.limit, params]);

    const changePage = (page) => {
        setPagination({ ...pagination, page });
    };

    const changeLimit = (limit) => {
        setPagination({ ...pagination, limit, page: 1 });
    };

    const updateParams = (newParams) => {
        setParams({ ...params, ...newParams });
        setPagination({ ...pagination, page: 1 });
    };

    return {
        attacks,
        loading,
        error,
        pagination,
        changePage,
        changeLimit,
        updateParams
    };
};

export default useAttacks;