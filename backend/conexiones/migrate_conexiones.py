import psycopg2
import sys
import os
import django
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_api_django.settings")
django.setup()

from conexiones.models import Conexion

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

def migrate_conexiones():
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
        print("Iniciando migración de Conexiones...")
        cur.execute("SELECT id, hora, ip_src, ip_dst, port_dst, etiqueta, protocolo FROM conexiones;")
        
        count = 0
        errors = 0
        
        for row in cur.fetchall():
            try:
                id_, hora, ip_src, ip_dst, port_dst, etiqueta, protocolo = row
                
                conexion, created = Conexion.objects.update_or_create(
                    id=id_,
                    defaults={
                        "hora": hora,
                        "ip_src": ip_src,
                        "ip_dst": ip_dst,
                        "port_dst": port_dst,
                        "etiqueta": etiqueta,
                        "protocolo": protocolo,
                    }
                )
                
                if created:
                    print(f"Creada conexión: {ip_src} -> {ip_dst}:{port_dst}")
                else:
                    print(f"Actualizada conexión: {ip_src} -> {ip_dst}:{port_dst}")
                count += 1
                
            except Exception as e:
                print(f"Error procesando registro {row}: {e}")
                errors += 1
        
        print(f"Migración completada: {count} conexiones procesadas, {errors} errores")
        
    except Exception as e:
        print(f"Error durante la migración: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    migrate_conexiones()