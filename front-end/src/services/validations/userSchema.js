import { z } from "zod";

// Esquema base para validar datos del usuario
export const userSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(2, "El nombre es obligatorio"),
  apellido: z.string().min(2, "El apellido es obligatorio"),
  usuario: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  numero: z
    .string()
    .regex(/^[0-9]{8,15}$/, "Debe ser un número válido (8-15 dígitos)"),
  correo: z.string().email("Correo electrónico inválido"),
  rol: z.enum(["1", "2", "3"]),
  activo: z.boolean().default(true),
  contrasena: z.string().min(9, "La contraseña debe tener al menos 9 caracteres").optional(),
});

// Esquema para crear/editar usuarios
export const userFormSchema = userSchema.omit({ id: true });