import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, getUsers, updateUser } from "../api/usersService";
import { toast } from "react-toastify";
import { userSchema } from "../validations/userSchema";

export const useUsers = (filters) => {
  console.log("Fetching users with filters:", filters);   
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    keepPreviousData: true,
    onSuccess: (res) => {
      toast.success(res.message || "Usuarios cargados correctamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al cargar usuarios");
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const parsed = userSchema.parse(userData);
      console.log("Creating user with data:", parsed);
      return createUser(parsed);
    },
    onSuccess: () => {
      toast.success("Usuario creado correctamente");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear usuario");
      console.error("Error creating user:", error);
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }) => {
      const parsed = userSchema.parse(userData);
      return updateUser(id, parsed);
    },
    onSuccess: () => {
      toast.success("Usuario actualizado correctamente");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar usuario");
      console.error("Error updating user:", error);
    }
  });
};

export const useDeleteUser = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () => {
      toast.success("Usuario eliminado correctamente");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar usuario");
    }
  });
};