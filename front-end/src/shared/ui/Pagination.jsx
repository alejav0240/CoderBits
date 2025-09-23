import React from 'react';

const Pagination = ({ pagination, onPageChange, onLimitChange }) => {
    const { currentPage, totalPages, itemsPerPage } = pagination;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="d-flex align-items-center">
                <span className="me-2">Mostrar:</span>
                <select 
                    className="form-select form-select-sm" 
                    style={{ width: '80px' }}
                    value={itemsPerPage}
                    onChange={(e) => onLimitChange(parseInt(e.target.value))}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <span className="ms-2">ítems por página</span>
            </div>

            <div className="d-flex align-items-center">
                <button
                    className="btn btn-outline-primary btn-sm me-2"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Anterior
                </button>

                <div className="btn-group">
                    {startPage > 1 && (
                        <>
                            <button className="btn btn-outline-primary btn-sm" onClick={() => onPageChange(1)}>
                                1
                            </button>
                            {startPage > 2 && <span className="btn btn-sm border-0">...</span>}
                        </>
                    )}

                    {pageNumbers.map(page => (
                        <button
                            key={page}
                            className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="btn btn-sm border-0">...</span>}
                            <button className="btn btn-outline-primary btn-sm" onClick={() => onPageChange(totalPages)}>
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                <button
                    className="btn btn-outline-primary btn-sm ms-2"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Siguiente
                </button>
            </div>

            <div>
                <span className="text-muted">
                    Página {currentPage} de {totalPages}
                </span>
            </div>
        </div>
    );
};

export default Pagination;