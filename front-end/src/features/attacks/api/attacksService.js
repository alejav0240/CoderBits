import { authService } from '../../../features/auth/api/authService';

const API_URL = 'http://localhost:3001/api';
const USE_MOCK_DATA = true;

// Simular delay de red
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const attacksService = {
    async getAttacks(page = 1, limit = 10, filters = {}) {
        if (USE_MOCK_DATA) {
            await simulateNetworkDelay();
            
            // Datos mock de ataques
            const mockAttacks = [
                {
                    id: 1,
                    name: "DDoS UDP Flood",
                    type: "ddos",
                    severity: "high",
                    source: "192.168.1.100",
                    target: "10.0.0.50",
                    description: "Ataque de denegación de servicio distribuido mediante UDP flood",
                    packets: 15000,
                    bytes: 52428800,
                    timestamp: new Date().toISOString(),
                    mitigated: true,
                    signature: "DDoS-UDP-Flood"
                },
                {
                    id: 2,
                    name: "Port Scanning TCP",
                    type: "scanning",
                    severity: "medium",
                    source: "203.0.113.45",
                    target: "10.0.0.100",
                    description: "Escaneo de puertos TCP en múltiples servicios",
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
                },
                {
                    id: 4,
                    name: "Brute Force SSH",
                    type: "brute_force",
                    severity: "high",
                    source: "10.0.1.200",
                    target: "ssh-server-01",
                    description: "Ataque de fuerza bruta contra servicio SSH",
                    packets: 1200,
                    bytes: 1024000,
                    timestamp: new Date(Date.now() - 10800000).toISOString(),
                    mitigated: true,
                    signature: "BRUTE-FORCE-SSH"
                },
                {
                    id: 5,
                    name: "Phishing Campaign",
                    type: "phishing",
                    severity: "medium",
                    source: "malicious-domain.com",
                    target: "Multiple Users",
                    description: "Campaña de phishing mediante correos electrónicos",
                    packets: 80,
                    bytes: 25600,
                    timestamp: new Date(Date.now() - 14400000).toISOString(),
                    mitigated: false,
                    signature: "PHISHING-CAMPAIGN"
                }
            ];

            // Aplicar filtros
            let filteredData = mockAttacks;
            
            if (filters.severity) {
                filteredData = filteredData.filter(item => item.severity === filters.severity);
            }
            
            if (filters.type) {
                filteredData = filteredData.filter(item => item.type === filters.type);
            }
            
            if (filters.mitigated !== undefined) {
                filteredData = filteredData.filter(item => item.mitigated === (filters.mitigated === 'true'));
            }

            // Paginación
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedData = filteredData.slice(startIndex, endIndex);

            return {
                data: paginatedData,
                total: filteredData.length,
                totalPages: Math.ceil(filteredData.length / limit),
                currentPage: page
            };
        }

        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...filters
            });

            const response = await fetch(
                `${API_URL}/attacks?${queryParams}`,
                { headers: getAuthHeaders() }
            );

            if (!response.ok) throw new Error('Error al obtener ataques');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getAttackStats(timeRange = '24h') {
        if (USE_MOCK_DATA) {
            await simulateNetworkDelay();
            
            // Datos mock para estadísticas
            return {
                hourly: Array.from({ length: 24 }, (_, i) => ({
                    hour: `${i}:00`,
                    count: Math.floor(Math.random() * 50) + 10
                })),
                byType: [
                    { name: 'DDoS', value: 35 },
                    { name: 'Scanning', value: 25 },
                    { name: 'Intrusion', value: 20 },
                    { name: 'Brute Force', value: 15 },
                    { name: 'Phishing', value: 5 }
                ],
                bySeverity: [
                    { severity: 'critical', count: 5 },
                    { severity: 'high', count: 15 },
                    { severity: 'medium', count: 25 },
                    { severity: 'low', count: 10 }
                ]
            };
        }

        try {
            const response = await fetch(
                `${API_URL}/attacks/stats?range=${timeRange}`,
                { headers: getAuthHeaders() }
            );
            if (!response.ok) throw new Error('Error al obtener estadísticas');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getRealTimeAttacks() {
        if (USE_MOCK_DATA) {
            await simulateNetworkDelay();
            
            // Simular datos en tiempo real
            return {
                attacks: Array.from({ length: 5 }, (_, i) => ({
                    id: Date.now() + i,
                    type: ['ddos', 'scanning', 'intrusion'][Math.floor(Math.random() * 3)],
                    severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
                    source: `192.168.1.${Math.floor(Math.random() * 255)}`,
                    target: `10.0.0.${Math.floor(Math.random() * 255)}`,
                    timestamp: new Date().toISOString()
                }))
            };
        }

        try {
            const response = await fetch(
                `${API_URL}/attacks/realtime`,
                { headers: getAuthHeaders() }
            );
            if (!response.ok) throw new Error('Error al obtener ataques en tiempo real');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    }
};