// app/history.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import api from '../services/api'; // Asegúrate de que esta ruta sea correcta: 'services' o 'service'

// Tipos de datos
interface Ataque {
  id: number;
  tipo_ataque: string;
  fecha_deteccion: string;
  ip_origen: string;
}

interface Stats {
  total_ataques: number;
  mitigaciones_aplicadas: number;
  ataques_por_tipo: { [key: string]: number };
}

// -------------------------------------------------------------------
// Componente para una sola barra del gráfico
// -------------------------------------------------------------------

interface BarProps {
    label: string;
    count: number;
    maxCount: number;
}

const SimpleBar: React.FC<BarProps> = ({ label, count, maxCount }) => {
    // Calcula el porcentaje de ancho basado en el ataque más frecuente
    const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
    
    // Asigna un color básico
    const barColor = '#4a90e2';

    return (
        <View style={barStyles.barRow}>
            <Text style={barStyles.barLabel}>{label}</Text>
            <View style={barStyles.barContainer}>
                <View style={[barStyles.barFill, { width: `${barWidth}%`, backgroundColor: barColor }]} />
            </View>
            <Text style={barStyles.barCount}>{count}</Text>
        </View>
    );
};

const barStyles = StyleSheet.create({
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    barLabel: {
        width: 80, // Ancho fijo para las etiquetas (tipos de ataque)
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    barContainer: {
        flex: 1, // Ocupa el espacio restante
        height: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginHorizontal: 10,
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
    barCount: {
        width: 30,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: 'bold',
    },
});


// -------------------------------------------------------------------
// Componente principal de Estadísticas e Historial
// -------------------------------------------------------------------

export default function StatsAndHistoryScreen() {
    const [ataques, setAtaques] = useState<Ataque[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // ... (Lógica de fetchData es la misma, solo cambiamos la API si es necesario)
        try {
            setLoading(true);
            const statsResponse = await api.get('dashboard/stats/');
            setStats(statsResponse.data);

            const attacksResponse = await api.get('ataques/'); 
            setAtaques(attacksResponse.data);
        } catch (error: any) {
            console.error('Error al obtener datos:', error.response?.data || error.message);
            Alert.alert("Error de Carga", "No se pudo cargar los datos. Revisa la IP y el servidor.");
        } finally {
            setLoading(false);
        }
    };
    
    // Función de renderizado para cada elemento de la lista (es la misma)
    const renderItem = ({ item }: { item: Ataque }) => (
        <View style={styles.item}>
            <Text style={styles.ip}>IP Origen: {item.ip_origen}</Text>
            <Text>Tipo: {item.tipo_ataque}</Text>
            <Text>Fecha: {new Date(item.fecha_deteccion).toLocaleString()}</Text>
        </View>
    );

    // -------------------------------------------------------------------
    // Lógica y Renderizado del Gráfico Simple
    // -------------------------------------------------------------------
    
    const renderChart = () => {
        if (!stats || !stats.ataques_por_tipo || Object.keys(stats.ataques_por_tipo).length === 0) {
            return <Text style={styles.noData}>No hay datos de ataques por tipo para mostrar.</Text>;
        }

        const dataEntries = Object.entries(stats.ataques_por_tipo);
        // Encuentra el ataque con el mayor conteo para normalizar las barras
        const maxCount = Math.max(...Object.values(stats.ataques_por_tipo)); 
        
        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Distribución de Ataques por Tipo</Text>
                {dataEntries.map(([label, count]) => (
                    <SimpleBar 
                        key={label} 
                        label={label} 
                        count={count} 
                        maxCount={maxCount} 
                    />
                ))}
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
            <Text style={styles.header}>Estadísticas Clave</Text>
            
            {/* 1. Muestra los gráficos simples (Barras) */}
            {renderChart()}
            
            {/* 2. Muestra estadísticas clave */}
            <View style={styles.statsSummary}>
                <Text style={styles.summaryItem}>Total Ataques: {stats?.total_ataques ?? 0}</Text>
                <Text style={styles.summaryItem}>Mitigados: {stats?.mitigaciones_aplicadas ?? 0}</Text>
            </View>

            {/* 3. Muestra el historial en la parte inferior */}
            <Text style={[styles.header, { marginTop: 20, marginBottom: 5 }]}>Historial de Incidentes</Text>
            {ataques.map(item => renderItem({ item }))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 22, fontWeight: 'bold', padding: 15, backgroundColor: '#e0e0e0' },
    // Estilos para el contenedor del gráfico
    chartContainer: { padding: 15, backgroundColor: '#fff', marginVertical: 10, borderRadius: 8, marginHorizontal: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    noData: { textAlign: 'center', padding: 20, color: '#666' },
    // Estilos para el resumen de estadísticas
    statsSummary: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ccc' },
    summaryItem: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
    // Estilos para el historial
    item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
    ip: { fontWeight: 'bold' },
});