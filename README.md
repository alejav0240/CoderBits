# CoderBits — Captura de Red y Monitoreo (IDS con ML)

**Descripción corta**
Proyecto para captura y monitoreo de tráfico de red basado en Django (API + WebSocket), con un módulo de detección basado en Machine Learning entrenado sobre CIC-IDS2017. Incluye frontend en React (Vite) y app móvil en React Native para visualización y control.

---

## 🔎 Resumen de componentes

* **Backend**: Django REST API + WebSockets (Daphne / Channels). Gestiona captura, almacenamiento, alertas y mitigaciones.
* **Machine Learning**: Modelo entrenado (Keras/TensorFlow) con features del dataset **CIC-IDS2017**. Inferencia en tiempo real desde un sniffer (Scapy) que envía resultados al backend.
* **Frontend**: React + Vite para panel de control, administración y visualización en tiempo real.
* **Mobile**: React Native (expo o CLI) para notificaciones y visualización rápida en móvil.
* **DB**: PostgreSQL (recomendado) — tablas: `Conexion`, `Ataque`, `Mitigacion`, `Personal`, `Roles`, etc.
* **Captura de paquetes**: Npcap (Windows) / libpcap (Linux/macOS).

---

## 📌 Requisitos

* **Python** 3.13+
* **PostgreSQL** 17 (u otra BD compatible Django)
* **Node.js** 18+ (para frontend y mobile)
* **Npcap** (Windows) o `libpcap` (Linux)
* Permisos de administrador/root para capturar paquetes y bloquear IPs
* (Opcional) GPU con drivers y TensorFlow compatible si entrenarás modelos grandes

---

## ⚙️ Configuración (Backend)

1. Clonar repo y crear entorno:

```bash
git clone <repo-url>
cd CoderBits
python -m venv venv
# activar
# Windows:
venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate
```

2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

3. Variables de entorno: crea un `.env` en la raíz (usa .env.example como guía):

```
SECRET_KEY=tu_secret_key
DB_NAME=nombre_bd
DB_USER=usuario
DB_PASSWORD=contraseña
DB_HOST=localhost
DB_PORT=5432
DJANGO_DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
```

4. Crear BD y migraciones:

```bash
# crear migraciones
python manage.py makemigrations
# aplicar migraciones
python manage.py migrate
# aplicar todas (si tienes script)
python migrate_all.py
```

5. Cargar datos iniciales (si aplica):

Ejecutar `postgresql_IDS.sql` en tu instancia de PostgreSQL para poblar datos iniciales.

6. Crear superusuario Django:

```bash
python manage.py createsuperuser
# abrir http://127.0.0.1:8000/admin/
```

---

## 🚀 Run (Desarrollo)

* Servidor Django (dev):

```bash
python manage.py runserver
```

* Servidor ASGI con Daphne (WebSockets):

```bash
daphne -p 8000 mi_api_django.asgi:application
```

* Visitar:

  * API: `http://127.0.0.1:8000/api/`
  * Admin: `http://127.0.0.1:8000/admin/`

---

## 📡 Captura de red (Sniffer)

* La captura puede activarse desde el panel admin o programáticamente:

```python
from conexiones.monitoreo import monitor_activo
monitor_activo = True  # o False
```

* Los flujos capturados se guardan en la tabla `Conexion`.
* Para ejecutar el sniffer local con Scapy (ejemplo):

```bash
sudo python monitor_cicids.py  # script de ejemplo que extrae 78 features y hace inferencia
```

---

## 🧠 Machine Learning

### Estructura y artefactos

* `modelo_cicids2017.h5` — Modelo Keras (inferencia).
* `scaler.pkl` — `StandardScaler` usado para normalizar features de entrada.
* Features esperadas: **78 columnas** (CIC-IDS2017 — todas las columnas numéricas excepto `Label`).
* Dataset: CIC-IDS2017 (usado para entrenamiento / validación).

### Reentrenamiento (básico)

1. Preparar CSVs del CIC-IDS2017 y concatenarlos.
2. Limpieza: eliminar columnas no numéricas, strip de headers, manejo `NaN`, `inf`.
3. Label encoding: `Label` → indices.
4. Train/Test split (estratificado).
5. `StandardScaler().fit(X_train)` → guardar con `joblib.dump(scaler, 'scaler.pkl')`
6. Entrenar red (ej. Keras `Sequential` densa) con `sparse_categorical_crossentropy`.
7. Guardar modelo: `model.save('modelo_cicids2017.h5')`

### Inferencia en tiempo real

* **Pipeline**:

  1. Sniffer (Scapy) agrupa paquetes por flow key (src,dst,src_port,dst_port,proto).
  2. Extractor calcula las **78 features** compatibles con CICFlowMeter.
  3. `scaler.transform(features)` → `model.predict(...)`.
  4. Resultado: enviar evento por WebSocket a `ws://127.0.0.1:8000/ws/alertas/` y guardar registro en DB.

> ⚠️ Importante: asegúrate de que `scaler` y el modelo sean los mismos que se usaron en entrenamiento; si hay mismatch de número de features obtendrás errores.

---

## 🧩 Frontend (React + Vite)

### Estructura

* Carpeta: `frontend/`
* Stack: React + Vite, React Router, SWR/React Query o Redux, Tailwind (opcional).

### Setup local

```bash
cd frontend
npm install
# dev
npm run dev
# build
npm run build
# preview del build
npm run preview
```

### Variables de entorno

Crea `.env.local` en `frontend/`:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_WS_URL=ws://127.0.0.1:8000/ws/monitoreo/
```

### Funcionalidades principales del frontend

* Dashboard en tiempo real (con WebSocket)
* Panel para activar/desactivar monitoreo
* Visualización de conexiones y ataques detectados
* Páginas de administración (usuarios, roles, mitigaciones)
* Reportes y export (JSON/CSV)

---

## 📱 Mobile (React Native)

### Setup (con Expo recomendado)

```bash
# con expo
npm install -g expo-cli
cd mobile
npm install
expo start
```

Variables `.env` o config local:

```
API_BASE_URL=http://127.0.0.1:8000/api
WS_URL=ws://127.0.0.1:8000/ws/alertas/
```

Funcionalidades:

* Conexión a WebSocket para alertas push en la app
* Listado de ataques recientes y detalles
* Botón rápido para desactivar/activar monitoreo (si permisos lo permiten)

---

## 🔗 Endpoints principales (resumen)

### Conexiones

* `GET /api/conexiones/`
* `GET /api/conexiones/<id>/`
* `POST /api/conexiones/activar_monitoreo/`
* `POST /api/conexiones/desactivar_monitoreo/`
* `POST api/conexiones/iniciar_automatico/`
* `POST api/conexiones/detener_automatico/`

### Personal / Roles

* `GET /api/personales/`, `POST /api/personales/`, `GET/PUT/DELETE /api/personales/<id>/`
* `POST /api/personales/login_personal/`
* `api/logout_personal/`

### Ataques / Mitigaciones

* `GET /api/ataques/`, `GET /api/ataques/<id>/`
* `GET /api/mitigaciones/`, `POST /api/mitigaciones/<id>/activar/`, `POST /api/mitigaciones/<id>/desactivar/`

### Dashboard / Reportes

* `GET /api/dashboard/stats/`
* `GET /api/dashboard/export/json/`

### WebSockets

* `ws://127.0.0.1:8000/ws/monitoreo/` — eventos de conexiones en tiempo real
* `ws://127.0.0.1:8000/ws/alertas/` — alertas de seguridad / ataques detectados

---

## 🧪 Testing y QA

* Test unitarios Django: `python manage.py test`
* Pruebas manuales: usar tu plan de pruebas (Test Plan Excel)
* Integración ML: validar pipeline de features (78 features) → scaler → modelo
* Pruebas de stress: simular tráfico con `traffic_simulator_no_api.py`:

```bash
cd backend/ataques/
python traffic_simulator_no_api.py -t <ip_dispositivo> -m all -d 15 --threads 4
```

---

## 🛠️ Troubleshooting común

* **`ModuleNotFoundError: No module named 'sklearn'`** → `pip install scikit-learn`
* **Scaler espera 78 features pero recibe X** → Asegúrate de extraer exactamente las 78 columnas en el mismo orden con el que entrenaste el scaler.
* **Permisos para sniffing** → Ejecuta scripts con `sudo` o como administrador; instala Npcap en Windows.
* **Daphne / Channels** → Asegúrate de tener `channels` y `daphne` instalados y configurado `ASGI_APPLICATION`.
* **TensorFlow logs (oneDNN)**: mensaje informativo — no crítico.

---

## 🧾 Buenas prácticas

* Versiona tu `scaler.pkl` y `modelo_cicids2017.h5` junto con el commit que los generó (o registra hashes).
* Mantén un `requirements.txt` actualizado (`pip freeze > requirements.txt`) y, preferiblemente, un archivo `environment.yml` o Dockerfile.
* Documenta el **orden exacto de las 78 features** en un archivo (por ejemplo `features_list.csv`) y consúmelo desde tu extractor para evitar bugs.

---

## 📁 Archivos importantes en el repo

* `backend/` — código Django
* `backend/monitor_cicids.py` — sniffer + extractor
* `backend/models/` — modelos Django (Conexion, Ataque, Mitigacion, Personal)
* `frontend/` — React + Vite
* `mobile/` — React Native
* `model/` — `modelo_cicids2017.h5`, `scaler.pkl`, `features_list.csv`
* `docs/` — documentos (test plans, diagramas, etc.)

---

## 👥 Contribución

Si vas a contribuir:

1. Revisa issues y ramas en GitHub.
2. Crea branch: `feature/<descripcion>`
3. PR con descripción y screenshots.
4. Añade tests y documentación.

