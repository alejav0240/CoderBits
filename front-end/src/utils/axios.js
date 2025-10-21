import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL? import.meta.env.VITE_API_URL : 'http://localhost:8000/api/',
});

// Rutas donde NO se debe enviar el token
const excludedRoutes = ["personales/login_personal/", "/api/login/", "token/refresh/"];

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("AUTH_CROCA");

    const isExcluded = excludedRoutes.some(route =>
        config.url?.includes(route)
    );

    if (token && !isExcluded) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor para manejar errores y renovar el token si es necesario
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config ;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("Token expirado, intentando renovar...");
            originalRequest._retry = true;

            const refresh = localStorage.getItem("REFRESH_CROCA");
            if (!refresh) {
                console.warn("No hay refresh token");
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL? import.meta.env.VITE_API_URL : 'http://localhost:8000/api/'}/refresh/`, {
                    refresh: refresh
                });

                const newAccess = res.data.access;
                localStorage.setItem("AUTH_CROCA", newAccess);

                // Actualiza el token para el nuevo intento
                api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

                // Reintenta la petición original
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Falló el refresh token:", refreshError);
                localStorage.removeItem("AUTH_CROCA");
                localStorage.removeItem("REFRESH_CROCA");
                // Aquí puedes redirigir al login si quieres
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;