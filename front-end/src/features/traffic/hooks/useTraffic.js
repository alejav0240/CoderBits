import { useState, useEffect } from 'react';
import trafficService from '../../../services/trafficService';

export const useTraffic = (initialParams = {}) => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [monitoringStatus, setMonitoringStatus] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0
    });
    const [params, setParams] = useState(initialParams);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                setLoading(true);
                const queryParams = {
                    page: pagination.page,
                    limit: pagination.limit,
                    ...params
                };
                
                const response = await trafficService.getConnections(queryParams);
                
                setConnections(response.results || []);
                setPagination({
                    ...pagination,
                    totalItems: response.count || 0,
                    totalPages: Math.ceil((response.count || 0) / pagination.limit)
                });
            } catch (err) {
                console.error('Error al cargar conexiones:', err);
                setError('No se pudieron cargar las conexiones');
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, [pagination.page, pagination.limit, params]);

    useEffect(() => {
        const checkMonitoringStatus = async () => {
            try {
                const status = await trafficService.getMonitoringStatus();
                setMonitoringStatus(status.active || false);
            } catch (err) {
                console.error('Error al verificar estado de monitoreo:', err);
            }
        };

        checkMonitoringStatus();
    }, []);

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

    const startMonitoring = async () => {
        try {
            await trafficService.startMonitoring();
            setMonitoringStatus(true);
            return true;
        } catch (err) {
            console.error('Error al iniciar monitoreo:', err);
            return false;
        }
    };

    const stopMonitoring = async () => {
        try {
            await trafficService.stopMonitoring();
            setMonitoringStatus(false);
            return true;
        } catch (err) {
            console.error('Error al detener monitoreo:', err);
            return false;
        }
    };

    return {
        connections,
        loading,
        error,
        monitoringStatus,
        pagination,
        changePage,
        changeLimit,
        updateParams,
        startMonitoring,
        stopMonitoring
    };
};