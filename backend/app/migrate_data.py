import psycopg2
import sys
import os
import django

# Agrega la raíz del proyecto al path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_api_django.settings")
django.setup()

from app.models import Rol, Personal, Conexion, Ataque, Mitigacion

# Conexión a la DB antigua
conn = psycopg2.connect(
    dbname="ids_seguridad",      # Nombre de tu DB antigua
    user="postgres",          # Usuario de PostgreSQL
    password="12345678",     # Contraseña
    host="localhost",
    port="5432"
)

cur = conn.cursor()

# ===== Migrar Roles =====
cur.execute("SELECT id_rol, nombre_rol FROM roles;")
for row in cur.fetchall():
    rol_id, nombre = row
    Rol.objects.update_or_create(id=rol_id, defaults={"nombre_rol": nombre})

# ===== Migrar Personales =====
cur.execute("""
    SELECT id_persona, nombre, apellido, numero, correo, usuario, contrasena, id_rol, activo, fecha_registro
    FROM personales;
""")
for row in cur.fetchall():
    (
        id_persona, nombre, apellido, numero, correo, usuario, contrasena, id_rol, activo, fecha_registro
    ) = row
    try:
        rol = Rol.objects.get(id=id_rol)
    except Rol.DoesNotExist:
        rol = None
    Personal.objects.update_or_create(
        id=id_persona,
        defaults={
            "nombre": nombre,
            "apellido": apellido,
            "numero": numero,
            "correo": correo,
            "usuario": usuario,
            "contrasena": contrasena,
            "rol": rol,
            "activo": activo,
            "fecha_registro": fecha_registro,
        }
    )

# ===== Migrar Conexiones =====
cur.execute("SELECT id, hora, ip_src, ip_dst, port_dst, etiqueta, confianza FROM conexiones;")
for row in cur.fetchall():
    id_, hora, ip_src, ip_dst, port_dst, etiqueta, confianza = row
    Conexion.objects.update_or_create(
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

# ===== Migrar Ataques =====
cur.execute("""
    SELECT id_ataque, tipo, descripcion, ip_origen, ip_destino, puerto, fecha_detectado, conteo_conexiones, activo
    FROM ataques;
""")
for row in cur.fetchall():
    id_, tipo, descripcion, ip_origen, ip_destino, puerto, fecha_detectado, conteo_conexiones, activo = row
    Ataque.objects.update_or_create(
        id=id_,
        defaults={
            "tipo": tipo,
            "descripcion": descripcion,
            "ip_origen": ip_origen,
            "ip_destino": ip_destino,
            "puerto": puerto,
            "fecha_detectado": fecha_detectado,
            "conteo_conexiones": conteo_conexiones,
            "activo": activo,
        }
    )

# ===== Migrar Mitigaciones =====
cur.execute("""
    SELECT id_mitigacion, id_ataque, detalle, ejecutado_por, activo, fecha_mitigacion, resultado
    FROM mitigaciones;
""")
for row in cur.fetchall():
    id_mitigacion, id_ataque, detalle, ejecutado_por, activo, fecha_mitigacion, resultado = row
    try:
        ataque = Ataque.objects.get(id=id_ataque)
    except Ataque.DoesNotExist:
        ataque = None
    try:
        personal = Personal.objects.get(id=ejecutado_por)
    except Personal.DoesNotExist:
        personal = None
    Mitigacion.objects.update_or_create(
        id=id_mitigacion,
        defaults={
            "ataque": ataque,
            "detalle": detalle,
            "ejecutado_por": personal,
            "activo": activo,
            "fecha_mitigacion": fecha_mitigacion,
            "resultado": resultado,
        }
    )

cur.close()
conn.close()