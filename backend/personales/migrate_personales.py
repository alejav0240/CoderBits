import psycopg2
import sys
import os
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_api_django.settings")
django.setup()

from personales.models import Personal
from roles.models import Rol

def migrate_personales():
    conn = psycopg2.connect(
        dbname="ids_seguridad",      
        user="postgres",          
        password="12345678",     
        host="localhost",
        port="5432"
    )
    
    cur = conn.cursor()
    
    try:
        print("Iniciando migración de Personal...")
        cur.execute("""
            SELECT id_persona, nombre, apellido, numero, correo, usuario, contrasena, id_rol, activo, fecha_registro
            FROM personales;
        """)
        
        count = 0
        errors = 0
        
        for row in cur.fetchall():
            try:
                (id_persona, nombre, apellido, numero, correo, usuario, 
                 contrasena, id_rol, activo, fecha_registro) = row
                
                # Buscar el rol
                rol = None
                if id_rol:
                    try:
                        rol = Rol.objects.get(id=id_rol)
                    except Rol.DoesNotExist:
                        print(f"Rol con ID {id_rol} no encontrado para usuario {usuario}")
                        rol = None
                
                personal, created = Personal.objects.update_or_create(
                    id=id_persona,
                    defaults={
                        "nombre": nombre,
                        "apellido": apellido,
                        "numero": numero or 0,  # Manejo de valores nulos
                        "correo": correo,
                        "usuario": usuario,
                        "contrasena": contrasena,
                        "rol": rol,
                        "activo": activo if activo is not None else True,
                        "fecha_registro": fecha_registro,
                    }
                )
                
                if created:
                    print(f"Creado: {nombre} {apellido} ({usuario})")
                else:
                    print(f"ctualizado: {nombre} {apellido} ({usuario})")
                count += 1
                
            except Exception as e:
                print(f"Error procesando registro {row}: {e}")
                errors += 1
        
        print(f"Migración completada: {count} registros procesados, {errors} errores")
        
    except Exception as e:
        print(f"Error durante la migración: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    migrate_personales()