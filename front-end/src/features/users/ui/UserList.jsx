import React, { useState } from 'react';
import { useUsers } from '../../../services/query/useUsers';
import UserCard from './UserCard';
import UserPagination from './UserPagination';

const UserList = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);

    const { data, isLoading, isError, error } = useUsers(page, limit);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger">
                Error: {error.message}
            </div>
        );
    }

    const users = data ?? [];
    const pagination = data?.pagination;
    console.log("Datos de usuarios:", users);

    return (
        <div>
            <h3>Lista de Usuarios</h3>

            <div className="row">
                {users.length > 0 ? users.map(user => (
                    <div key={user.id} className="col-md-6 col-lg-4 mb-3">
                        <UserCard user={user} />
                    </div>
                )) : (
                    <p>No hay usuarios para mostrar.</p>
                )}
            </div>

            <UserPagination
                pagination={pagination}
                onPageChange={setPage}
                onLimitChange={setLimit}
            />
        </div>
    );
};

export default UserList;
