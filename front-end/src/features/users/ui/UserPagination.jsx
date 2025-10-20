import React from 'react';

const UserPagination = ({ pagination, onPageChange, onLimitChange }) => {
    if (!pagination) return null; // ✅ evita errores si aún no llega la paginación

    const { currentPage, totalPages, limit } = pagination;

    return (
        <div className="d-flex justify-content-between align-items-center mt-3">

            {/* Selector de cantidad por página */}
            <div className="d-flex align-items-center">
                <span className="me-2">Mostrar:</span>
                <select 
                    className="form-select form-select-sm"
                    style={{ width: '80px' }}
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            {/* Botones de paginación */}
            <div>
                <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    ◀ Anterior
                </button>

                <span> Página {currentPage} de {totalPages} </span>

                <button 
                    className="btn btn-sm btn-outline-primary ms-2"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Siguiente ▶
                </button>
            </div>
        </div>
    );
};

export default UserPagination;
