import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../services/validations/authValidation"; 
import { useLogin } from '../../../services/query/useAuth'; 
import React from 'react'; // Importar React para JSX

const LoginForm = () => {
    // Definición de handleSubmit: Se crea la función que maneja el envío.
    const handleLogin = (data) => {
        mutate(data);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            // ✅ Campo 1: 'usuario'
            usuario: "",
            // ✅ Campo 2: 'contrasena' (Ajustado para coincidir con el uso en el input)
            contrasena: "",
        },
    });

    // Se extrae la lógica de mutación y estado de pendiente del hook
    const { mutate, isPending } = useLogin();

    // 💡 Corrección: La función que se pasa al form es handleSubmit, que envuelve a handleLogin
    const onSubmit = handleSubmit(handleLogin); 

    return (
        <div className="card">
            <div className="card-body">
                <h3 className="card-title text-center">Iniciar Sesión</h3>

                {/* 💡 Corrección: Usamos la variable 'onSubmit' definida arriba */}
                <form onSubmit={onSubmit}> 
                    <div className="mb-3">
                        {/* 💡 Mejora: La etiqueta 'htmlFor' debe coincidir con el 'id' del input */}
                        <label htmlFor="usuario" className="form-label">Usuario</label>
                        <input
                            id="usuario"
                            placeholder="admin@test.com"
                            type="text"
                            className="form-control"
                            // ✅ Uso de campo: 'usuario'
                            {...register("usuario")}
                        />
                        {/* Muestra errores del campo 'usuario' */}
                        {errors.usuario && <span className="text-danger small">{errors.usuario.message}</span>}
                    </div>

                    <div className="mb-3">
                        {/* 💡 Mejora: La etiqueta 'htmlFor' debe coincidir con el 'id' del input */}
                        <label htmlFor="clave" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            // ✅ Se corrige el ID del input a 'clave' para coincidir con el defaultValue
                            id="clave" 
                            placeholder="password"
                            // ✅ Se corrige el nombre del campo a 'contrasena'
                            {...register("contrasena")}
                        />
                        {/* Muestra errores del campo 'contrasena' */}
                        {errors.contrasena && <span className="text-danger small">{errors.contrasena.message}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        // ✅ Corrección: Usamos SÓLO 'isPending' del hook useLogin
                        disabled={isPending} 
                    >
                        {/* ✅ Corrección: Usamos SÓLO 'isPending' para el texto */}
                        {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'} 
                    </button>
                </form>

                <div className="mt-3">
                    <small className="text-muted">
                        <strong>Credenciales de prueba:</strong><br />
                        Email: admin@test.com<br />
                        Password: password
                    </small>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;