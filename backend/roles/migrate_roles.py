import psycopg2
import sys
import os
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_api_django.settings")
django.setup()

from roles.models import Rol

def migrate_roles():
    conn = psycopg2.connect(
        dbname="ids_seguridad",      
        user="postgres",          
        password="12345678",     
        host="localhost",
        port="5432"
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