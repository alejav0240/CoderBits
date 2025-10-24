// components/Alerts.tsx
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications'; // Asegúrate de tener este import

// Reemplaza con la IP real de tu servidor (no localhost)
const WS_URL = 'ws://127.0.0.1:8000/ws/alertas/'; 

export function WebSocketAlerts() {
  useEffect(() => {
    
    //AQUÍ SE DEFINE LA FUNCIÓN handleAlert (Solución)
    async function handleAlert(alertData: any) {
        // Asegúrate de solicitar permisos
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            // No uses Alert.alert si estás fuera de la app (en background)
            // Solo loguea el error o maneja silenciosamente
            console.warn('Permiso de notificación denegado.'); 
            return;
        }

        // Estructura de la notificación
        Notifications.scheduleNotificationAsync({
            content: {
                title: '🚨 ¡ALERTA DE SEGURIDAD! 🚨',
                body: `Tipo: ${alertData.tipo_ataque || 'Desconocido'} - IP: ${alertData.ip_origen || 'N/A'}`,
                data: alertData, 
            },
            trigger: null,
        });
    }

    // 1. Crear el objeto WebSocket
    const ws = new WebSocket(WS_URL);

    // 2. Manejar la apertura de la conexión
    ws.onopen = () => {
      console.log('WebSocket conectado a alertas!');
    };

    // 3. Manejar los mensajes entrantes (Alertas)
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('Nueva Alerta Recibida:', data);
        
        // ¡Ahora handleAlert está definida y accesible!
        handleAlert(data); 
        
      } catch (error) {
        console.error('Error al parsear el mensaje WS:', error);
      }
    };
    
    return () => {
      ws.close();
    };
  }, []);

  return null;
}