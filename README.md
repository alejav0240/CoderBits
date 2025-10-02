CoderBits – Captura de Red y Monitoreo

Este proyecto es una API en Django que captura tráfico de red y lo guarda en la base de datos.
Incluye un panel de administración para activar/desactivar la captura y gestionar las conexiones registradas.

📌 Requisitos

Python 3.13 o superior

PostgreSQL (o cualquier base de datos compatible con Django)

Windows: Npcap
 (para captura de paquetes de red)

⚙️ Configuración del proyecto

Crear entorno virtual (desde la raíz del proyecto)

python -m venv venv


Activar entorno virtual

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate


Instalar dependencias

pip install -r requirements.txt


Variables de entorno
Crear un archivo .env en la raíz del proyecto:

DB_NAME=nombre_bd
DB_USER=usuario
DB_PASSWORD=contraseña
DB_HOST=localhost
DB_PORT=5432

🗄️ Base de datos y migraciones
Acción	Comando
Crear nuevas migraciones	python manage.py makemigrations
Aplicar migraciones	python manage.py migrate
Aplicar todas las migraciones automáticamente	python migrate_all.py
Ver base de datos	python manage.py dbshell
👤 Usuario administrador

Crear un superusuario para acceder al panel de Django Admin:

python manage.py createsuperuser


Ingresa usuario, correo y contraseña. Luego abrir en el navegador:
http://127.0.0.1:8000/admin/

🚀 Levantar servidor de desarrollo
python manage.py runserver
🚀 Levantar servidor con webSocket
daphne -p 8000 mi_api_django.asgi:application



Visitar en el navegador:
http://127.0.0.1:8000/

🖧 Captura de red (Sniffer)

La captura se ejecuta en segundo plano automáticamente.

Para activar o desactivar la captura:

from conexiones.monitoreo import monitor_activo

monitor_activo = True   # Activar captura
monitor_activo = False  # Desactivar captura


También puedes hacerlo desde el panel de administración con los botones:
Activar Monitoreo / Desactivar Monitoreo

No se crean tablas adicionales; todo se guarda en la tabla Conexion.

🔒 Hasheo de contraseñas (opcional)

Si deseas cambiar la contraseña de un usuario desde la base de datos:

python manage.py shell

from django.contrib.auth.hashers import make_password
from app.models import Personal  # Ajusta según tu app

user = Personal.objects.get(usuario="wass")
user.contrasena = make_password("12345678")
user.save()

📦 Congelar librerías

Para exportar las dependencias instaladas:

pip freeze > requirements.txt

Esto facilita instalar todo en otro equipo con:

pip install -r requirements.txt
git c
💻 Endpoints de la API
La API de CoderBits expone las siguientes rutas para interactuar con los datos de captura de red y gestión del sistema. Todas las rutas siguen una convención RESTful y están precedidas por la base /api/.

1. Conexiones (conexiones) 🌐
Gestiona los registros de tráfico de red capturado.

* GET /api/conexiones/ - Lista todas las conexiones de red registradas.

* GET /api/conexiones/<id>/ - Recupera los detalles de una conexión específica.

* GET /api/monitoreo/activar/ - Inicia el monitoreo de tráfico.

* GET /api/monitoreo/desactivar/ - Inicia el monitoreo de tráfico.

2. Roles (roles) 🛡️
Permite la gestión de roles de usuario para el control de acceso.

* GET /api/roles/ - Lista todos los roles de usuario definidos.

* POST /api/roles/ - Crea un nuevo rol.

* GET /api/roles/<id>/ - Recupera los detalles de un rol específico.

* PUT/PATCH /api/roles/<id>/ - Actualiza (total o parcial) un rol.

* DELETE /api/roles/<id>/ - Elimina un rol.

3. Personal (personales) 👤
Administra la información del personal o usuarios del sistema.

* GET /api/personales/ - Lista todos los usuarios/personal registrados.

* POST /api/personales/ - Crea un nuevo registro de usuario.

* GET /api/personales/<id>/ - Recupera los detalles de un usuario.

* PUT/PATCH /api/personales/<id>/ - Actualiza (total o parcial) un usuario.

* DELETE /api/personales/<id>/ - Elimina un usuario.

4. Ataques (ataques) 🚨
Gestiona la información o registros relacionados con ataques detectados.

* GET /api/ataques/ - Lista todos los registros de ataques detectados.

* GET /api/ataques/<id>/ - Recupera los detalles de un ataque específico.

5. Mitigaciones (mitigaciones) ✅
Gestiona las estrategias o acciones de mitigación implementadas.

* GET /api/mitigaciones/ - Lista todas las estrategias de mitigación.

* GET /api/mitigaciones/<id>/ - Recupera los detalles de una mitigación específica.

* POST /api/mitigaciones/<id>/activar/ - Realizar una mitigacion.

6. WebSocket

* ws://127.0.0.1:8000/ws/monitoreo/ 