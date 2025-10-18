import { useState, useEffect } from 'react';
import usersService from '../../../services/usersService';

export const useUsers = (initialParams = {}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roles, setRoles] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0
    });
    const [params, setParams] = useState(initialParams);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const queryParams = {
                page: pagination.page,
                limit: pagination.limit,
                ...params
            };
            
            const response = await usersService.getUsers(queryParams);
            
            setUsers(response.results || []);
            setPagination({
                ...pagination,
                totalItems: response.count || 0,
                totalPages: Math.ceil((response.count || 0) / pagination.limit)
            });
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('No se pudieron cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, pagination.limit, params]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await usersService.getRoles();
                setRoles(rolesData);
            } catch (err) {
                console.error('Error al cargar roles:', err);
            }
        };

        fetchRoles();
    }, []);

    const changePage = (page) => {
        setPagination({ ...pagination, page });
    };

    const changeLimit = (limit) => {
        setPagination({ ...pagination, limit, page: 1 });
    };

    const updateParams = (newParams) => {
        setParams({ ...params, ...newParams });
        setPagination({ ...pagination, page: 1 });
    };

    const createUser = async (userData) => {
        try {
            const response = await usersService.createUser(userData);
            await fetchUsers();
            return response;
        } catch (err) {
            console.error('Error al crear usuario:', err);
            throw err;
        }
    };

    const updateUser = async (id, userData) => {
        try {
            const response = await usersService.updateUser(id, userData);
            setUsers(users.map(user => user.id === id ? response : user));
            return response;
        } catch (err) {
            console.error('Error al actualizar usuario:', err);
            throw err;
        }
    };

    const deleteUser = async (id) => {
        try {
            await usersService.deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
            return true;
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            throw err;
        }
    };

    return {
        users,
        roles,
        loading,
        error,
        pagination,
        fetchUsers,
        changePage,
        changeLimit,
        updateParams,
        createUser,
        updateUser,
        deleteUser
    };
};

export default useUsers;