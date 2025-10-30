import React, { useCallback } from "react";
import { Edit, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { useDeleteUser } from "../../../services/query/useUsers";

const UserCard = ({ user, onEdit }) => {

  const mutation = useDeleteUser(user.id);
  const onDelete = useCallback(() => {
    if (window.confirm(`¿Estás seguro de eliminar a ${user.nombre} ${user.apellido}?`)) {
      mutation.mutate();
    }
  }, [user, mutation]);

  const getRolBadge = useCallback((rol) => {
    const map = {
      1: { color: "red", label: "Administrador" },
      2: { color: "blue", label: "Operador" },
      3: { color: "slate", label: "Usuario" },
    };
    const { color, label } = map[rol] || map.user;
    return (
      <span
        className={`px-3 py-1 bg-${color}-500/20 border border-${color}-500/30 rounded-full text-xs text-${color}-400 font-medium`}
      >
        {label}
      </span>
    );
  }, []);


  return (
    <tr className="hover:bg-slate-900/30 transition-colors">
      <td className="px-6 py-4">
        <div>
          <div className="text-white font-medium">
            {user.nombre} {user.apellido}
          </div>
          <div className="text-sm text-slate-400">@{user.usuario}</div>
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
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              user.activo ? "bg-green-400" : "bg-red-400"
            }`}
          ></div>
          <span
            className={`text-sm ${
              user.activo ? "text-green-400" : "text-red-400"
            }`}
          >
            {user.activo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-400">
        <div className="flex items-center space-x-2">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(user.fecha_registro).toLocaleDateString("es-ES")}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end space-x-2">
          <button
            onClick={onEdit}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(UserCard);
