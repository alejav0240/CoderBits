import psycopg2
import sys
import os
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_api_django.settings")
django.setup()

from mitigaciones.models import Mitigacion
from ataques.models import Ataque
from personales.models import Personal

def migrate_mitigaciones():
    conn = psycopg2.connect(
        dbname="ids_seguridad",      
        user="postgres",          
        password="12345678",     
        host="localhost",
        port="5432"
    )
    
    cur = conn.cursor()
    
    try:
        print("Iniciando migración de Mitigaciones...")
        cur.execute("""
            SELECT id_mitigacion, id_ataque, detalle, ejecutado_por, activo, 
                   fecha_mitigacion, resultado
            FROM mitigaciones;
        """)
        
        count = 0
        errors = 0
        
        for row in cur.fetchall():
            try:
                (id_mitigacion, id_ataque, detalle, ejecutado_por, activo, 
                 fecha_mitigacion, resultado) = row
                
                # Buscar el ataque relacionado
                ataque = None
                if id_ataque:
                    try:
                        ataque = Ataque.objects.get(id=id_ataque)
                    except Ataque.DoesNotExist:
                        print(f"Ataque con ID {id_ataque} no encontrado")
                        continue  # Skip this record if attack doesn't exist
                
                # Buscar el personal que ejecutó la mitigación
                personal = None
                if ejecutado_por:
                    try:
                        personal = Personal.objects.get(id=ejecutado_por)
                    except Personal.DoesNotExist:
                        print(f"Personal con ID {ejecutado_por} no encontrado")
                
                mitigacion, created = Mitigacion.objects.update_or_create(
                    id=id_mitigacion,
                    defaults={
                        "ataque": ataque,
                        "detalle": detalle,
                        "ejecutado_por": personal,
                        "activo": activo if activo is not None else True,
                        "fecha_mitigacion": fecha_mitigacion,
                        "resultado": resultado,
                    }
                )
                
                if created:
                    print(f"Creada mitigación para ataque ID {id_ataque}")
                else:
                    print(f"Actualizada mitigación para ataque ID {id_ataque}")
                count += 1
                
            except Exception as e:
                print(f"Error procesando registro {row}: {e}")
                errors += 1
        
        print(f"Migración completada: {count} mitigaciones procesadas, {errors} errores")
        
    except Exception as e:
        print(f"Error durante la migración: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    migrate_mitigaciones()