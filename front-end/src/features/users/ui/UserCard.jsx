import React from 'react';

const UserCard = ({ user }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{user.nombre} {user.apellido}</h5>
                <p className="card-text">
                    <strong>Email:</strong> {user.correo}<br/>
                    <strong>Rol:</strong> {user.rol || 'Usuario'}
                </p>
            </div>
        </div>
    );
};

export default UserCard; // ✅ Esto es importante