import { useState, useEffect } from 'react';
import { trafficService } from '../api/trafficService';

export const useTraffic = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [topTraffic, setTopTraffic] = useState([]);
    const [networkStatus, setNetworkStatus] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeTrafficData = async () => {
            setLoading(true);
            try {
                // Cargar datos iniciales
                const [topData, statusData] = await Promise.all([
                    trafficService.getTopTraffic(5),
                    trafficService.getNetworkStatus()
                ]);
                
                setTopTraffic(topData);
                setNetworkStatus(statusData);
                
                // Configurar WebSocket mock
                const socket = trafficService.connectWebSocket((newData) => {
                    setTrafficData(prev => {
                        const updated = [...prev, { 
                            ...newData, 
                            timestamp: new Date().toLocaleTimeString(),
                            id: Date.now() 
                        }];
                        return updated.slice(-50); // Mantener últimos 50 puntos
                    });
                });

                // Simular conexión exitosa
                setTimeout(() => {
                    setIsConnected(true);
                    setLoading(false);
                }, 1000);

            } catch (error) {
                console.error('Error initializing traffic data:', error);
                setLoading(false);
            }
        };

        initializeTrafficData();

        // Cleanup
        return () => {
            trafficService.disconnectWebSocket();
        };
    }, []);

    return {
        trafficData,
        topTraffic,
        networkStatus,
        isConnected,
        loading
    };
};

export default useTraffic;