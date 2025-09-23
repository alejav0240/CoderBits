// Configuración de la aplicación
export const CONFIG = {
    // Cambiar a false cuando tengas backend real
    USE_MOCK_DATA: true,
    
    // URL del backend (cuando USE_MOCK_DATA = false)
    API_URL: 'http://localhost:3001/api',
    
    // Configuración de desarrollo
    DEVELOPMENT: {
        simulateNetworkDelay: true,
        delayMs: 500
    },
    
    // Configuración de features
    FEATURES: {
        realTimeUpdates: true,
        chartsEnabled: true,
        exportEnabled: false
    }
};

// Función para simular delay de red (solo en desarrollo)
export const simulateNetworkDelay = () => {
    if (CONFIG.USE_MOCK_DATA && CONFIG.DEVELOPMENT.simulateNetworkDelay) {
        return new Promise(resolve => setTimeout(resolve, CONFIG.DEVELOPMENT.delayMs));
    }
    return Promise.resolve();
};