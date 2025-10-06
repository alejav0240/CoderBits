import { authService } from '../../../features/auth/api/authService';

const API_URL = 'http://localhost:3001/api';
const USE_MOCK_DATA = true; // Cambiar a false cuando tengas backend

// Datos mock para desarrollo
const mockMitigations = [
    {
        id: 1,
        name: "Firewall Rule - SSH Protection",
        description: "Bloquea intentos de fuerza bruta en puerto SSH",
        type: "firewall",
        status: "active",
        severity: "high",
        ruleCount: 5,
        lastApplied: new Date(Date.now() - 3600000).toISOString(),
        source: "IDS System"
    },
    {
        id: 2,
        name: "WAF - SQL Injection Prevention",
        description: "Protección contra inyecciones SQL en aplicaciones web",
        type: "waf",
        status: "active",
        severity: "critical",
        ruleCount: 12,
        lastApplied: new Date(Date.now() - 7200000).toISOString(),
        source: "Web Application"
    },
    {
        id: 3,
        name: "DDoS Mitigation - UDP Flood",
        description: "Mitigación de ataques DDoS tipo UDP flood",
        type: "ddos",
        status: "pending",
        severity: "high",
        ruleCount: 8,
        lastApplied: new Date(Date.now() - 86400000).toISOString(),
        source: "Network Monitor"
    },
    {
        id: 4,
        name: "IPS - Port Scanning Detection",
        description: "Detección y bloqueo de escaneos de puertos",
        type: "ips",
        status: "disabled",
        severity: "medium",
        ruleCount: 3,
        lastApplied: new Date(Date.now() - 172800000).toISOString(),
        source: "Security System"
    },
    {
        id: 5,
        name: "Malware Blocklist",
        description: "Lista de dominios maliciosos conocidos",
        type: "firewall",
        status: "active",
        severity: "medium",
        ruleCount: 156,
        lastApplied: new Date().toISOString(),
        source: "Threat Intelligence"
    }
];

const getAuthHeaders = () => {
    const token = authService.getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Simular delay de red
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const mitigationService = {
    async getMitigations(page = 1, limit = 10, filters = {}) {
        if (USE_MOCK_DATA) {
            await simulateNetworkDelay();
            
            // Aplicar filtros a los datos mock
            let filteredData = mockMitigations;
            
            if (filters.status) {
                filteredData = filteredData.filter(item => item.status === filters.status);
            }
            
            if (filters.type) {
                filteredData = filteredData.filter(item => item.type === filters.type);
            }
            
            if (filters.severity) {
                filteredData = filteredData.filter(item => item.severity === filters.severity);
            }
            
            // Simular paginación
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
                `${API_URL}/mitigations?${queryParams}`,
                { headers: getAuthHeaders() }
            );

            if (!response.ok) throw new Error('Error al obtener mitigaciones');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getMitigationById(id) {
        if (USE_MOCK_DATA) {
            await simulateNetworkDelay();
            const mitigation = mockMitigations.find(item => item.id === parseInt(id));
            if (!mitigation) throw new Error('Mitigación no encontrada');
            return mitigation;
        }

        try {
            const response = await fetch(`${API_URL}/mitigations/${id}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Error al obtener mitigación');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async createMitigation(mitigationData) {
        if (USE_MOCK_DATA) {
            await simulateNetworkDelay();
            const newMitigation = {
                id: Math.max(...mockMitigations.map(m => m.id)) + 1,
                ...mitigationData,
                status: 'pending',
                lastApplied: new Date().toISOString()
            };
            mockMitigations.push(newMitigation);
            return newMitigation;
        }

        try {
            const response = await fetch(`${API_URL}/mitigations`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(mitigationData)
            });
            if (!response.ok) throw new Error('Error al crear mitigación');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async updateMitigation(id, mitigationData) {
        if (USE_MOCK_DATA) {
            await simulateNetworkDelay();
            const index = mockMitigations.findIndex(item => item.id === parseInt(id));
            if (index === -1) throw new Error('Mitigación no encontrada');
            mockMitigations[index] = { ...mockMitigations[index], ...mitigationData };
            return mockMitigations[index];
        }

        try {
            const response = await fetch(`${API_URL}/mitigations/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(mitigationData)
            });
            if (!response.ok) throw new Error('Error al actualizar mitigación');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async applyMitigation(mitigationId) {
        if (USE_MOCK_DATA) {
            await simulateNetworkDelay();
            const mitigation = mockMitigations.find(item => item.id === parseInt(mitigationId));
            if (!mitigation) throw new Error('Mitigación no encontrada');
            
            mitigation.status = 'active';
            mitigation.lastApplied = new Date().toISOString();
            
            return { success: true, message: 'Mitigación aplicada correctamente' };
        }

        try {
            const response = await fetch(`${API_URL}/mitigations/${mitigationId}/apply`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Error al aplicar mitigación');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    }
};