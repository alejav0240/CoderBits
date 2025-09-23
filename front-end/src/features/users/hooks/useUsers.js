import { useState, useEffect } from 'react';
import { userService } from '../api/userService';

export const useUsers = (initialPage = 1, initialLimit = 10) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: initialPage,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: initialLimit
    });

    const fetchUsers = async (page = pagination.currentPage, limit = pagination.itemsPerPage) => {
        setLoading(true);
        setError(null);
        try {
            // Datos de ejemplo para probar (eliminar cuando tengas el backend)
            const mockData = {
                data: [
                    { id: 1, name: 'Juan Pérez', email: 'juan@test.com', role: 'Admin' },
                    { id: 2, name: 'María García', email: 'maria@test.com', role: 'Usuario' },
                    { id: 3, name: 'Carlos López', email: 'carlos@test.com', role: 'Usuario' },
                ],
                total: 3,
                totalPages: 1,
                currentPage: 1
            };
            
            // Para usar con backend real, descomenta esto:
            // const response = await userService.getUsers(page, limit);
            // setUsers(response.data || response.users || []);
            // setPagination({
            //     currentPage: page,
            //     totalPages: response.totalPages || 1,
            //     totalItems: response.total || 0,
            //     itemsPerPage: limit
            // });

            // Usar datos de ejemplo por ahora
            setUsers(mockData.data);
            setPagination({
                currentPage: page,
                totalPages: mockData.totalPages,
                totalItems: mockData.total,
                itemsPerPage: limit
            });
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const changePage = (newPage) => {
        fetchUsers(newPage, pagination.itemsPerPage);
    };

    const changeLimit = (newLimit) => {
        fetchUsers(1, newLimit);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        pagination,
        fetchUsers,
        changePage,
        changeLimit
    };
};

export default useUsers; // ✅ Export default también