import React, { useState, useCallback, useMemo } from "react";
import { useUsers } from "../../../services/query/useUsers";
import UserCard from "./UserCard";
import Filters from "./Filters";
import UserPagination from "./UserPagination";
import StatsCards from "./StatsCards";
import { UserModal } from "./UserModal";


const UserList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [activeFilters, setActiveFilters] = useState({});
  const [modal, setModal] = useState({
    open: false,
    mode: "create",
    user: null,
  });

  const queryParams = useMemo(() => ({ ...activeFilters, page, limit }), [activeFilters, page, limit]);

  const { data, isLoading, isError, error, isFetching } = useUsers(queryParams);

  const users = data?.results ?? [];
  const pagination = data?.pagination ?? {};
  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const handlePageChange = useCallback((newPage) => setPage(newPage), []);
  const handleLimitChange = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  // Handler para aplicar filtros (coincide con MitigationList)
  const handleFilterChange = useCallback((newFilters) => {
    setActiveFilters(newFilters);
    setPage(1);
  }, []);

  const handleOpenModal = useCallback((mode, user = null) => {
    setModal({ open: true, mode, user });
    console.log("open modal ");
    console.log(modal.user);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModal({ open: false, mode: "create", user: null });
  }, []);

  const stats = useMemo(() => {
    return {
      total: users.length,
      activos: users.filter((u) => u.activo).length,
      inactivos: users.filter((u) => !u.activo).length,
      admins: users.filter((u) => u.rol === "admin").length,
    };
  }, [users]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <span className="text-white ml-3">Cargando...</span>
      </div>
    );

  if (isError)
    return (
      <div className="p-4 bg-red-800/20 border border-red-700/50 text-red-400 rounded-xl">
        Error al cargar usuarios: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      <StatsCards users={users} stats={stats} />

      <Filters
        onFilterChange={handleFilterChange}
        setPage={setPage}
        openCreateModal={() => {
          console.log("open create modal");
          handleOpenModal("create");
        }}
      />

      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700/50">
              <tr>
                {[
                  "Usuario",
                  "Contacto",
                  "Rol",
                  "Estado",
                  "Registro",
                  "Acciones",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.length > 0 ? (
                users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={() => handleOpenModal("edit", user)}
                    onDelete={() =>
                      window.confirm(`¿Eliminar al usuario ${user.usuario}?`) &&
                      console.log("Eliminar", user.id)
                    }
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <UserPagination
            pagination={{
              currentPage: page,
              totalPages,
              itemsPerPage: limit,
              totalItems,
            }}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>

      {modal.open && (
        <UserModal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, mode: "create", user: null })}
          modalMode={modal.mode} // "create" o "edit"
          user={modal.user}
        />
      )}
    </div>
  );
};

export default UserList;
