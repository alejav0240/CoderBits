import { useState, useEffect } from 'react';
import { mitigationService } from '../api/mitigationService';

export const useMitigations = (initialPage = 1, initialLimit = 10) => {
    const [mitigations, setMitigations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: initialPage,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: initialLimit
    });
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        severity: ''
    });

    const fetchMitigations = async (page = pagination.currentPage, limit = pagination.itemsPerPage, newFilters = filters) => {
        setLoading(true);
        setError(null);
        try {
            const response = await mitigationService.getMitigations(page, limit, newFilters);
            
            setMitigations(response.data || []);
            setPagination({
                currentPage: page,
                totalPages: response.totalPages || 1,
                totalItems: response.total || 0,
                itemsPerPage: limit
            });
        } catch (err) {
            setError(err.message);
            console.error('Error fetching mitigations:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (newFilters) => {
        setFilters(newFilters);
        fetchMitigations(1, pagination.itemsPerPage, newFilters);
    };

    const applyMitigation = async (mitigationId) => {
        try {
            await mitigationService.applyMitigation(mitigationId);
            await fetchMitigations(); // Recargar datos
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        fetchMitigations();
    }, []);

    return {
        mitigations,
        loading,
        error,
        pagination,
        filters,
        fetchMitigations,
        applyFilters,
        applyMitigation,
        changePage: (page) => fetchMitigations(page, pagination.itemsPerPage, filters),
        changeLimit: (limit) => fetchMitigations(1, limit, filters)
    };
};

export default useMitigations;