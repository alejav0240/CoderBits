import React from 'react';
import UserList from '../features/users/ui/UserList';

const UsersPage = () => {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-12">
                    <div className="card shadow-soft border-0">
                        <div className="card-header bg-white py-4">
                            <h1 className="h2 mb-0">👥 Gestión de Usuarios</h1>
                            <p className="text-muted mb-0">Administra los usuarios del sistema</p>
                        </div>
                        <div className="card-body p-4">
                            <UserList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;