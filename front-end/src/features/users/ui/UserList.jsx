import React, { useState, useCallback, useMemo } from "react";
import { useUsers } from "../../../services/query/useUsers";
import UserCard from "./UserCard";
import UserPagination from "./UserPagination";
import StatsCards from "./StatsCards";
import Filters from "./Filters";
import {
  Shield,
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const UserList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [filters, setFilters] = useState({});

  const { data, isLoading, isError, error } = useUsers(page, limit, filters);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    numero: '',
    correo: '',
    usuario: '',
    rol: 'user',
    activo: true
  });

  const users = data ?? [];
  console.log("Users array:", users);
  const pagination = data?.pagination;
  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 0;

  const getRolBadge = useCallback((rol) => {
    const configs = {
      admin: { color: "red", label: "Administrador" },
      operator: { color: "blue", label: "Operador" },
      user: { color: "slate", label: "Usuario" },
    };
    const config = configs[rol] || configs.user;
    return (
      <span
        className={`px-3 py-1 bg-${config.color}-500/20 border border-${config.color}-500/30 rounded-full text-xs text-${config.color}-400 font-medium`}
      >
        {config.label}
      </span>
    );
  }, []);

  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        numero: user.numero,
        correo: user.correo,
        usuario: user.usuario,
        rol: user.rol,
        activo: user.activo,
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        numero: '',
        correo: '',
        usuario: '',
        rol: 'user',
        activo: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      nombre: '',
      apellido: '',
      numero: '',
      correo: '',
      usuario: '',
      rol: 'user',
      activo: true
    });
  };

  const handleSubmit = () => {
    console.log("Submit Form Data:", formData);
    handleCloseModal();
  };

  const handleToggleStatus = (userId) => {
    console.log(`Toggle status for user ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${userId}?`)) {
      console.log(`Deleting user ID: ${userId}`);
    }
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleOpenCreateModal = () => handleOpenModal('create', null);
  const startIndex = (page - 1) * limit;

  console.log("Rendering UserList with users:", users);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <span className="text-white ml-3">Cargando...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 bg-red-800/20 border border-red-700/50 text-red-400 rounded-xl">Error al cargar usuarios: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <StatsCards users={users} />
      <Filters 
            setFilters={setFilters} 
            setPage={setPage} 
            openCreateModal={handleOpenCreateModal} // Pasa la función para abrir el modal
        />

      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Registro
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">
                          {user.nombre} {user.apellido}
                        </div>
                        <div className="text-sm text-slate-400">
                          @{user.usuario}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-300">{user.correo}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-300">{user.numero}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRolBadge(user.rol)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="flex items-center space-x-2"
                      >
                        {user.activo ? (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm text-green-400">Activo</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-sm text-red-400">Inactivo</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(user.fecha_registro).toLocaleDateString(
                            "es-ES"
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal("edit", user)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                        No se encontraron usuarios.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <UserPagination
                pagination={{ currentPage: page, totalPages, itemsPerPage: limit }}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                totalItems={totalItems}
            />
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">
                {modalMode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Apellido</label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Usuario</label>
                  <input
                    type="text"
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Rol</label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="user">Usuario</option>
                    <option value="operator">Operador</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Estado</label>
                  <select
                    value={formData.activo ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.value === 'active' })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-slate-700">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all"
              >
                {modalMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;