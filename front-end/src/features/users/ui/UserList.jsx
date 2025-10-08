import React from 'react';
import { useUsers } from '../hooks/useUsers';
import UserCard from './UserCard';
import UserPagination from './UserPagination';

const UserList = () => {
    const { users, loading, error, pagination, changePage, changeLimit } = useUsers();

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                Error: {error}
            </div>
        );
    }

    return (
        <div>
            <h3>Lista de Usuarios</h3>
            
            <div className="row">
                {users.map(user => (
                    <div key={user.id} className="col-md-6 col-lg-4 mb-3">
                        <UserCard user={user} />
                    </div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="alert alert-info">
                    No hay usuarios registrados.
                </div>
            )}

            <UserPagination 
                pagination={pagination} 
                onPageChange={changePage}
                onLimitChange={changeLimit}
            />
        </div>
    );
};

export default UserList; // ✅ Export default