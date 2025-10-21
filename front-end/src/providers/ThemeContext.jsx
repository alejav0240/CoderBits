"use client";

import React, { createContext, useState, useContext, useEffect, useMemo } from "react";

// El contexto se inicializa con 'undefined'. 
// En JS no necesitamos definir el tipo ThemeContextType.
const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  // Inicializamos el estado 'theme' con un string, ya no necesitamos el tipado <Theme>
  const [theme, setTheme] = useState("light");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Este código solo se ejecutará en el lado del cliente (browser)
    // El 'as Theme | null' de TS se elimina.
    const savedTheme = localStorage.getItem("theme"); 
    // Usamos savedTheme si existe, sino, por defecto "light"
    const initialTheme = savedTheme || "light"; 

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      
      // Control de la clase 'dark' en el elemento <html>
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    // Ya no necesitamos el tipado 'prevTheme: Theme'
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  
  // Usamos useMemo para asegurar que el objeto de contexto solo cambie cuando 'theme' o 'toggleTheme' cambien
  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
  }), [theme]);


  return (
    // Proveemos el objeto de valor memorizado
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // Verificación de existencia del contexto
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  // El contexto ahora es el objeto { theme, toggleTheme }
  return context;
};