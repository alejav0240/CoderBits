import psycopg2
import sys
import os
import django
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_api_django.settings")
django.setup()

from ataques.models import Ataque

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


def migrate_ataques():
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
        print("Iniciando migración de Ataques...")
        cur.execute("""
            SELECT id_ataque, tipo, descripcion, ip_origen, ip_destino, puerto, 
                   fecha_detectado, conteo_conexiones, activo
            FROM ataques;
        """)
        
        count = 0
        errors = 0
        
        for row in cur.fetchall():
            try:
                (id_, tipo, descripcion, ip_origen, ip_destino, puerto, 
                 fecha_detectado, conteo_conexiones, activo) = row
                
                ataque, created = Ataque.objects.update_or_create(
                    id=id_,
                    defaults={
                        "tipo": tipo,
                        "descripcion": descripcion,
                        "ip_origen": ip_origen,
                        "ip_destino": ip_destino,
                        "puerto": puerto,
                        "fecha_detectado": fecha_detectado,
                        "conteo_conexiones": conteo_conexiones,
                        "activo": activo if activo is not None else True,
                    }
                )
                
                if created:
                    print(f"Creado ataque: {tipo} ({ip_origen} -> {ip_destino})")
                else:
                    print(f"Actualizado ataque: {tipo} ({ip_origen} -> {ip_destino})")
                count += 1
                
            except Exception as e:
                print(f"Error procesando registro {row}: {e}")
                errors += 1
        
        print(f"Migración completada: {count} ataques procesados, {errors} errores")
        
    except Exception as e:
        print(f"Error durante la migración: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    migrate_ataques()