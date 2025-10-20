// features/auth/model/schema.ts
import { z } from "zod";

export const loginSchema = z.object({
    usuario: z.string().min(1, "El nombre de usuario es obligatorio"),
    contrasena: z.string().min(1, "La contraseña es obligatoria"),
});
