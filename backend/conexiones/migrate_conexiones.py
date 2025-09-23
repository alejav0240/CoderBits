import psycopg2
import sys
import os
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_api_django.settings")
django.setup()

from conexiones.models import Conexion

def migrate_conexiones():
    conn = psycopg2.connect(
        dbname="ids_seguridad",      
        user="postgres",          
        password="12345678",     
        host="localhost",
        port="5432"
    )
    
    cur = conn.cursor()
    
    try:
        print("Iniciando migración de Conexiones...")
        cur.execute("SELECT id, hora, ip_src, ip_dst, port_dst, etiqueta, confianza FROM conexiones;")
        
        count = 0
        errors = 0
        
        for row in cur.fetchall():
            try:
                id_, hora, ip_src, ip_dst, port_dst, etiqueta, confianza = row
                
                conexion, created = Conexion.objects.update_or_create(
                    id=id_,
                    defaults={
                        "hora": hora,
                        "ip_src": ip_src,
                        "ip_dst": ip_dst,
                        "port_dst": port_dst,
                        "etiqueta": etiqueta,
                        "confianza": confianza,
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