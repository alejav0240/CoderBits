import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // ✅ Importación correcta
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import { ThemeProvider } from "./providers/ThemeContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider} from "./context/AuthContext.jsx";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {ModalProvider} from "./providers/ModalContext.jsx";

// 1. Crear el cliente de React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>    
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <AuthProvider>
                <ModalProvider>
                    <App />
                </ModalProvider>
            </AuthProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)