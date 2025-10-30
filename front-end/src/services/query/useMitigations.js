import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMitigaciones, toggleMitigation } from "../api/mitigationService.js";
import { toast } from "react-toastify";

export const useMitigaciones = (filters) => {
  return useQuery({
    queryKey: ["mitigaciones", filters],
    queryFn: () => getMitigaciones(filters),
    keepPreviousData: true,
    onSuccess: (res) => {
      toast.success(res.message || "Mitigaciones cargadas correctamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al cargar mitigaciones");
    },
  });
};

export const useToggleMitigation = (onStatusChange) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleMitigation,
    onSuccess: (result) => {
      toast.success(`Mitigación ${result.action} correctamente`);
      console.log(`✅ Mitigación ${result.action}:`, result.data);

      // Refresca la lista de mitigaciones
      queryClient.invalidateQueries(["mitigaciones"]);

      // Notifica al componente padre si se pasa un callback
      if (onStatusChange) {
        onStatusChange(result.id, result.action);
      }
    },
    onError: (error) => {
      toast.error(
        error.message || "Error al cambiar el estado de la mitigación"
      );
      console.error("❌ Error:", error);
    },
  });
};
