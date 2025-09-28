import psycopg2
import sys
import os
import django
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_api_django.settings")
django.setup()

env_path = Path(__file__).resolve().parent.parent / ".env"  
load_dotenv(dotenv_path=env_path)

from roles.models import Rol

def migrate_roles():
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
        # Migrar Roles
        print("Iniciando migración de Roles...")
        cur.execute("SELECT id_rol, nombre_rol FROM roles;")
        count = 0
        for row in cur.fetchall():
            rol_id, nombre = row
            rol, created = Rol.objects.update_or_create(
                id=rol_id, 
                defaults={"nombre_rol": nombre}
            )
            if created:
                print(f"Creado: {nombre}")
            else:
                print(f"Actualizado: {nombre}")
            count += 1
        
        print(f"Migración completada: {count} roles procesados")
        
    except Exception as e:
        print(f"Error durante la migración: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    migrate_roles()