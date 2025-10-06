import React from 'react';

const UserPagination = ({ pagination, onPageChange, onLimitChange }) => {
    const { currentPage, totalPages, itemsPerPage } = pagination;

    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
                <select 
                    value={itemsPerPage}
                    onChange={(e) => onLimitChange(parseInt(e.target.value))}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
            
            <div>
                <button 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Anterior
                </button>
                
                <span> Página {currentPage} de {totalPages} </span>
                
                <button 
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default UserPagination; // ✅ Export default