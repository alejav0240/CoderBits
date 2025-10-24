// app/login.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet } from 'react-native';
import api from '../services/api';
import { router } from 'expo-router';
// Importa tu librería de almacenamiento seguro (ej: expo-secure-store)

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('personales/login_personal/', {
        usuario, // El nombre del campo debe coincidir con tu backend
        contrasena: password, // Asegúrate de usar 'contrasena' si es lo que espera Django
      });

      // Suponiendo que tu backend devuelve un token o datos de usuario exitosos
      const token = response.data.token; 
      
      // 1. Guardar el token de forma segura (USAR expo-secure-store)
      // await SecureStore.setItemAsync('userToken', token);
      
      // 2. Navegar al Dashboard (la ruta /(tabs)/dashboard)
      router.replace('/dashboard'); 

    } catch (error: any) {
      console.error('Error de Login:', error.response?.data || error.message);
      Alert.alert("Error de Login", "Usuario o contraseña inválidos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Usuario" 
        value={usuario} 
        onChangeText={setUsuario} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      <Button title="Ingresar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});