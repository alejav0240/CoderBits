import psycopg2
import sys
import os
import django
from pathlib import Path
from dotenv import load_dotenv


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_api_django.settings")
django.setup()

from personales.models import Personal
from roles.models import Rol

env_path = Path(__file__).resolve().parent.parent / ".env"  
load_dotenv(dotenv_path=env_path)


def migrate_personales():
    db_name = os.getenv("DB_NAME")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST")
    db_port = os.getenv("DB_PORT")

    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
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