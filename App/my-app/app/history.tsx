// app/history.tsx (Renombrado conceptualmente para incluir estadísticas)

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit'; // Importa la librería de gráficos
import api from '../service/api'; // Corregido: asumimos que está en services/api

// Tipos de datosd
interface Ataque {
  id: number;
  tipo_ataque: string;
  fecha_deteccion: string;
  ip_origen: string;
}

interface Stats {
  total_ataques: number;
  mitigaciones_aplicadas: number;
  ataques_por_tipo: { [key: string]: number }; // Ejemplo de datos estadísticos
  // otros campos de /api/dashboard/stats/
}

// Ancho de la pantalla para el gráfico
const screenWidth = Dimensions.get("window").width;

// -------------------------------------------------------------------

export default function StatsAndHistoryScreen() {
  const [ataques, setAtaques] = useState<Ataque[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Petición GET para Estadísticas (MO-04: Gráficos/Stats)
      const statsResponse = await api.get('dashboard/stats/');
      setStats(statsResponse.data);

      // 2. Petición GET para Historial (MO-04: Lista)
      const attacksResponse = await api.get('ataques/'); 
      setAtaques(attacksResponse.data);

    } catch (error: any) {
      console.error('Error al obtener datos:', error.response?.data || error.message);
      Alert.alert("Error de Carga", "No se pudo cargar el historial ni las estadísticas. Revisa la conexión con el backend.");
    } finally {
      setLoading(false);
    }
  };

  // Función de renderizado para cada elemento de la lista
  const renderItem = ({ item }: { item: Ataque }) => (
    <View style={styles.item}>
      <Text style={styles.ip}>IP Origen: {item.ip_origen}</Text>
      <Text>Tipo: {item.tipo_ataque}</Text>
      <Text>Fecha: {new Date(item.fecha_deteccion).toLocaleString()}</Text>
    </View>
  );

  // -------------------------------------------------------------------
  // Lógica del Gráfico
  // -------------------------------------------------------------------
  
  const renderChart = () => {
    if (!stats || !stats.ataques_por_tipo) return null;

    // Convertir los datos de la API a un formato que el gráfico entienda
    const labels = Object.keys(stats.ataques_por_tipo);
    const dataValues = Object.values(stats.ataques_por_tipo);
    
    // Si no hay datos, no renderizar el gráfico
    if (labels.length === 0) return <Text style={styles.noData}>No hay datos de ataques por tipo.</Text>;

    const chartData = {
      labels: labels, // Ej: ['DDoS', 'XSS', 'SQLi']
      datasets: [
        {
          data: dataValues, // Ej: [10, 5, 2]
        }
      ]
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Conteo de Ataques por Tipo</Text>
        <BarChart
          data={chartData}
          width={screenWidth * 0.9} // Usar el 90% del ancho de la pantalla
          height={220}
          yAxisLabel="" // Puedes poner un signo de conteo si quieres
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0, // No mostrar decimales en el eje Y
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    );
  };
  
  // -------------------------------------------------------------------
  // Renderizado Final
  // -------------------------------------------------------------------

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando estadísticas y datos históricos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Estadísticas Diarias</Text>
      
      {/* 1. Muestra los gráficos */}
      {renderChart()}
      
      {/* 2. Muestra estadísticas clave */}
      <View style={styles.statsSummary}>
        <Text style={styles.summaryItem}>Total Ataques: {stats?.total_ataques ?? 0}</Text>
        <Text style={styles.summaryItem}>Mitigados: {stats?.mitigaciones_aplicadas ?? 0}</Text>
      </View>

      {/* 3. Muestra el historial en la parte inferior */}
      <Text style={[styles.header, { marginTop: 20 }]}>Historial de Incidentes</Text>
      {/* Usamos FlatList aquí, pero dentro de ScrollView necesitas un alto definido, 
          o podrías simplemente mapear los items para evitar problemas de anidamiento. */}
      {ataques.map(item => renderItem({ item }))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', padding: 15, backgroundColor: '#e0e0e0' },
  // Estilos para el gráfico
  chartContainer: { alignItems: 'center', marginVertical: 10, padding: 10 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  noData: { textAlign: 'center', padding: 20, color: '#666' },
  // Estilos para el resumen de estadísticas
  statsSummary: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  summaryItem: { fontSize: 16, fontWeight: '600' },
  // Estilos para el historial
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  ip: { fontWeight: 'bold' },
});