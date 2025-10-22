import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange, onLimitChange, totalItems }) => {
    const { currentPage, totalPages, itemsPerPage } = pagination;

    const [limit, setLimit] = useState(itemsPerPage || 9);

    useEffect(() => {
        if (itemsPerPage !== limit) {
            setLimit(itemsPerPage);
        }
    }, [itemsPerPage]);

    const handleLimitChange = (event) => {
        const newLimit = Number(event.target.value);
        setLimit(newLimit);
        if (onLimitChange) {
            onLimitChange(newLimit);
        }
    };

    const startIndex = (currentPage - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalItems);

    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-4 space-y-4 sm:space-y-0">
            
            {/* Displaying Info and Limit Select */}
            <div className="flex items-center space-x-4">
                <div className="text-sm text-slate-400 whitespace-nowrap">
                    Mostrando {totalItems > 0 ? startIndex + 1 : 0} - {endIndex} de {totalItems} ítems
                </div>

                <div className="flex items-center text-sm text-slate-400">
                    <label htmlFor="limit-select" className="mr-2 whitespace-nowrap">Mostrar:</label>
                    <select
                        id="limit-select"
                        value={limit}
                        onChange={handleLimitChange}
                        className="bg-slate-700 border border-slate-600 text-white rounded-lg p-1.5 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                        {[9, 15, 30, 50].map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-1">
                    {pageNumbers.map((p) => (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                                currentPage === p
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;