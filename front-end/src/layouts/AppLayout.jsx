import React from "react";
// Se asume que los archivos .tsx ahora son .js o .jsx
import { SidebarProvider, useSidebar } from "../../app/providers/SidebarContext";
import { Outlet, Navigate } from "react-router-dom"; 

// Componentes de UI
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import LoadingSpinner from "./LoadingSpinner";
// Solo se importa la función, el tipo EmpleadoInfo se elimina
import { useEmpleado } from "../../entities/empleados";

// --- Componente de Contenido del Layout ---
// Se elimina la definición de tipo LayoutContentProps
const LayoutContent = ({ userData }) => {
    // userData ya no tiene una anotación de tipo explícita

    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    // Clases de margen para el layout principal
    const sidebarMarginClass = isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]";
    const mobileMarginClass = isMobileOpen ? "ml-0" : "";

    return (
        <div className="flex min-h-screen">
            <div>
                {/* Estos componentes se asumen que están en archivos .js/.jsx */}
                <AppSidebar />
                <Backdrop />
            </div>

            <div
                className={`flex-1 transition-margin duration-300 ease-in-out ${sidebarMarginClass} ${mobileMarginClass}`}
            >
                <AppHeader userData={userData} />

                <main className="p-4 mx-auto max-w-screen-2xl md:p-6">
                    {/* El contenido de la ruta anidada */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};


// --- Componente Principal del Layout ---

export default function AppLayout() {
    // Los hooks siguen funcionando igual
    const { data: userData, isLoading, isError } = useEmpleado();

    // 1. Estado de Carga
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-25 dark:bg-gray-800">
                <LoadingSpinner />
            </div>
        );
    }

    // 2. Estado de Error (Redirección a login)
    if (isError) {
        return <Navigate to="/login" replace />;
    }

    // 3. Estado Exitoso (userData está disponible)
    if (userData) {
        return (
            // Proveedor del contexto de la barra lateral
            <SidebarProvider>
                <LayoutContent userData={userData} />
            </SidebarProvider>
        );
    }

    // 4. Estado Inesperado (userData no está disponible) - Fallback a login
    return <Navigate to="/login" replace />;
}
    