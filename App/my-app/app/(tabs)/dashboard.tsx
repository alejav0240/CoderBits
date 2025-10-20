// app/(tabs)/dashboard.tsx - Fragmento
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebSocketAlerts } from '../../components/alerts';
import HistoryScreen from '../history';

export default function DashboardScreen() {
  // <WebSocketAlerts /> se conectará al cargar la pantalla
  return (
    <View style={styles.container}>
            <WebSocketAlerts /> 
            <Text style={styles.title}>Dashboard Principal</Text>
            
            {/* 🛑 ERROR: HistoryScreen(); (Llamada a función JS) */}
            {/* ✅ CORRECCIÓN: Usar la sintaxis de componente JSX: */}
            <HistoryScreen /> 
            
        </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, // Esto hace que el contenedor ocupe toda la pantalla
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // Fondo blanco
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // Puedes agregar más estilos aquí
});