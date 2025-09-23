import subprocess
import sys
import os

def run_migration_script(script_path, app_name):
    """Ejecuta un script de migración y maneja errores"""
    print(f"\n{'='*50}")
    print(f"MIGRANDO {app_name.upper()}")
    print(f"{'='*50}")
    
    try:
        result = subprocess.run([sys.executable, script_path], 
                              capture_output=True, text=True, cwd=os.getcwd())
        
        if result.returncode == 0:
            print(result.stdout)
            print(f"{app_name} migrado exitosamente")
        else:
            print(f"Error en {app_name}:")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"Error ejecutando script de {app_name}: {e}")
        return False
    
    return True

def main():
    """Ejecuta todas las migraciones en orden"""
    print("🚀 Iniciando migración completa de datos")
    
    # Orden de migración (importantes las dependencias)
    migrations = [
        ("roles/migrate_roles.py", "ROLES"),
        ("personales/migrate_personales.py", "PERSONAL"),
        ("conexiones/migrate_conexiones.py", "CONEXIONES"),
        ("ataques/migrate_ataques.py", "ATAQUES"),
        ("mitigaciones/migrate_mitigaciones.py", "MITIGACIONES"),
    ]
    
    success_count = 0
    
    for script_path, app_name in migrations:
        if os.path.exists(script_path):
            if run_migration_script(script_path, app_name):
                success_count += 1
        else:
            print(f"⚠ Script no encontrado: {script_path}")
    
    print(f"\n{'='*50}")
    print(f"RESUMEN FINAL")
    print(f"{'='*50}")
    print(f"Migraciones exitosas: {success_count}")
    print(f"Migraciones fallidas: {len(migrations) - success_count}")
    print("Migración completa terminada")

if __name__ == "__main__":
    main()