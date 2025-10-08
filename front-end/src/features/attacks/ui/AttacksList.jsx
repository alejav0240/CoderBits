import React from 'react';
import { useAttacks } from '../hooks/useAttacks';
import AttacksCard from './AttacksCard';
import Pagination from '../../../shared/ui/Pagination';

const AttacksList = () => {
    const { 
        attacks, 
        loading, 
        error, 
        pagination, 
        changePage, 
        changeLimit 
    } = useAttacks();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando ataques...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                <h5>Error al cargar ataques</h5>
                <p className="mb-0">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Lista de Ataques Detectados</h4>
                <span className="badge bg-primary">
                    Total: {pagination.totalItems}
                </span>
            </div>

            <div className="row">
                {attacks.map(attack => (
                    <div key={attack.id} className="col-lg-6 mb-3">
                        <AttacksCard attack={attack} />
                    </div>
                ))}
            </div>

            {attacks.length === 0 && (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <i className="bi bi-shield-check display-4"></i>
                        <h5>No se detectaron ataques</h5>
                        <p>No hay actividades maliciosas registradas en el período seleccionado.</p>
                    </div>
                </div>
            )}

            {attacks.length > 0 && (
                <Pagination 
                    pagination={pagination}
                    onPageChange={changePage}
                    onLimitChange={changeLimit}
                />
            )}
        </div>
    );
};

export default AttacksList;