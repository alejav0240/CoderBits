import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "../../../services/validations/userSchema";
import { useCreateUser, useUpdateUser } from "../../../services/query/useUsers";

export const UserModal = ({ modalMode = "create", user = null, onClose }) => {
  const isEdit = modalMode === "edit";
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      usuario: "",
      numero: "",
      correo: "",
      rol: "user",
      contrasena: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  const mutation = isEdit ? updateUser : createUser;

  const onSubmit = (data) => {
    if (isEdit) {
      mutation.mutate({ id: user.id, userData: data });
    } else {
      mutation.mutate(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  {...register("nombre")}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {errors.nombre && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  {...register("apellido")}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {errors.apellido && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.apellido.message}
                  </p>
                )}
              </div>
            </div>

            {/* Usuario y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Usuario
                </label>
                <input
                  disabled={isEdit}
                  type="text"
                  {...register("usuario")}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {errors.usuario && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.usuario.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  {...register("numero")}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {errors.numero && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.numero.message}
                  </p>
                )}
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <input
                disabled={isEdit}
                type="email"
                {...register("correo")}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.correo && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.correo.message}
                </p>
              )}
            </div>

            {/* Rol y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rol
                </label>
                <select
                  {...register("rol")}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="1">Usuario</option>
                  <option value="2">Operador</option>
                  <option value="3">Administrador</option>
                </select>
              </div>
              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    {...register("contrasena")}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {errors.contrasena && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.contrasena.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all"
            >
              {mutation.isPending
                ? "Guardando..."
                : isEdit
                ? "Guardar Cambios"
                : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
