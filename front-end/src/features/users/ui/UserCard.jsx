import React from 'react';

const UserCard = ({ user }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">
                    <strong>Email:</strong> {user.email}<br/>
                    <strong>Rol:</strong> {user.role || 'Usuario'}
                </p>
            </div>
        </div>
    );
};

export default UserCard; // ✅ Esto es importante