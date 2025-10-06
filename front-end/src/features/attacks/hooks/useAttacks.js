import { useState, useEffect } from 'react';
import { attacksService } from '../api/attacksService';

export const useAttacks = (initialPage = 1, initialLimit = 10) => {
    const [attacks, setAttacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: initialPage,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: initialLimit
    });

    const fetchAttacks = async (page = pagination.currentPage, limit = pagination.itemsPerPage) => {
        setLoading(true);
        setError(null);
        try {
            // Datos de ejemplo para demostración
            const mockData = {
                data: [
                    {
                        id: 1,
                        name: "DDoS Attack",
                        type: "ddos",
                        severity: "high",
                        source: "192.168.1.100",
                        target: "10.0.0.50",
                        description: "Ataque de denegación de servicio distribuido",
                        packets: 15000,
                        bytes: 52428800,
                        timestamp: new Date().toISOString(),
                        mitigated: true,
                        signature: "DDoS-UDP-Flood"
                    },
                    {
                        id: 2,
                        name: "Port Scanning",
                        type: "scanning",
                        severity: "medium",
                        source: "203.0.113.45",
                        target: "10.0.0.100",
                        description: "Escaneo de puertos en múltiples servicios",
                        packets: 450,
                        bytes: 204800,
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        mitigated: false,
                        signature: "PORT-SCAN-TCP"
                    },
                    {
                        id: 3,
                        name: "SQL Injection Attempt",
                        type: "intrusion",
                        severity: "critical",
                        source: "198.51.100.23",
                        target: "web-server-01",
                        description: "Intento de inyección SQL en formulario de login",
                        packets: 25,
                        bytes: 5120,
                        timestamp: new Date(Date.now() - 7200000).toISOString(),
                        mitigated: true,
                        signature: "SQLi-UNION-SELECT"
                    }
                ],
                total: 3,
                totalPages: 1,
                currentPage: 1
            };

            // Para producción, descomentar:
            // const response = await attacksService.getAttacks(page, limit);
            // setAttacks(response.data || []);
            // setPagination({
            //     currentPage: page,
            //     totalPages: response.totalPages || 1,
            //     totalItems: response.total || 0,
            //     itemsPerPage: limit
            // });

            setAttacks(mockData.data);
            setPagination({
                currentPage: page,
                totalPages: mockData.totalPages,
                totalItems: mockData.total,
                itemsPerPage: limit
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const changePage = (newPage) => {
        fetchAttacks(newPage, pagination.itemsPerPage);
    };

    const changeLimit = (newLimit) => {
        fetchAttacks(1, newLimit);
    };

    useEffect(() => {
        fetchAttacks();
    }, []);

    return {
        attacks,
        loading,
        error,
        pagination,
        fetchAttacks,
        changePage,
        changeLimit
    };
};

export default useAttacks;