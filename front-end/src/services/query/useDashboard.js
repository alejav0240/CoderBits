import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardStats, getAttackStats, getTrafficStats, getRecentEvents, getAnalytics } from '../api/dashboardService';
import { toast } from 'react-toastify';

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => getDashboardStats(),
    onSuccess: (res) => {
      toast.success(res.message || "Dashboard stats cargados correctamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al cargar dashboard stats");
    },
  });
};

export function useAttackStats(params) {
    return useQuery(['attackStats', params], () => getAttackStats(params), {
        onError: (error) => {
            toast.error(error.message);
        },
    });
}

export function useTrafficStats(params) {
    return useQuery(['trafficStats', params], () => getTrafficStats(params), {
        onError: (error) => {
            toast.error(error.message);
        },
    });
}

export function useRecentEvents(limit) {
    return useQuery(['recentEvents', limit], () => getRecentEvents(limit), {
        onError: (error) => {
            toast.error(error.message);
        },
    });
}

export function useAnalytics(params) {
  return useQuery({
    queryKey: ["analytics", params],
    queryFn: () => getAnalytics(params),
    onError: (error) => {
      toast.error(error.message || "Error al cargar estadísticas");
    },
  });
}