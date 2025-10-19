import { useState, useEffect } from 'react';
import mitigationService from '../../../services/mitigationService';

export const useMitigation = (initialParams = {}) => {
    const [mitigations, setMitigations] = useState([]);
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
        const fetchMitigations = async () => {
            try {
                setLoading(true);
                const queryParams = {
                    page: pagination.page,
                    limit: pagination.limit,
                    ...params
                };
                
                const response = await mitigationService.getMitigations(queryParams);
                
                setMitigations(response.results || []);
                setPagination({
                    ...pagination,
                    totalItems: response.count || 0,
                    totalPages: Math.ceil((response.count || 0) / pagination.limit)
                });
            } catch (err) {
                console.error('Error al cargar mitigaciones:', err);
                setError('No se pudieron cargar las mitigaciones');
            } finally {
                setLoading(false);
            }
        };

        fetchMitigations();
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

    const createMitigation = async (mitigationData) => {
        try {
            const response = await mitigationService.createMitigation(mitigationData);
            setMitigations([response, ...mitigations]);
            return response;
        } catch (err) {
            console.error('Error al crear mitigación:', err);
            throw err;
        }
    };

    const updateMitigation = async (id, mitigationData) => {
        try {
            const response = await mitigationService.updateMitigation(id, mitigationData);
            setMitigations(mitigations.map(item => item.id === id ? response : item));
            return response;
        } catch (err) {
            console.error('Error al actualizar mitigación:', err);
            throw err;
        }
    };

    const deleteMitigation = async (id) => {
        try {
            await mitigationService.deleteMitigation(id);
            setMitigations(mitigations.filter(item => item.id !== id));
            return true;
        } catch (err) {
            console.error('Error al eliminar mitigación:', err);
            throw err;
        }
    };

    const applyMitigation = async (id) => {
        try {
            const response = await mitigationService.applyMitigation(id);
            return response;
        } catch (err) {
            console.error('Error al aplicar mitigación:', err);
            throw err;
        }
    };

    return {
        mitigations,
        loading,
        error,
        pagination,
        changePage,
        changeLimit,
        updateParams,
        createMitigation,
        updateMitigation,
        deleteMitigation,
        applyMitigation
    };
};