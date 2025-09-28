-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla de datos personales
CREATE TABLE IF NOT EXISTS personales (
    id_persona SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL, 
    numero NUMERIC NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL REFERENCES roles(id_rol) ON UPDATE CASCADE ON DELETE RESTRICT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de conexiones de red monitoreadas
CREATE TABLE IF NOT EXISTS conexiones (
    id SERIAL PRIMARY KEY,
    hora TIMESTAMP NOT NULL,
    ip_src VARCHAR(45) NOT NULL,
    ip_dst VARCHAR(45) NOT NULL,
    port_dst INT NOT NULL,
    etiqueta VARCHAR(50) NOT NULL,
    protocolo VARCHAR(50) NOT NULL
);

-- Índices para conexiones
CREATE INDEX IF NOT EXISTS idx_ip_src ON conexiones(ip_src);
CREATE INDEX IF NOT EXISTS idx_ip_dst ON conexiones(ip_dst);
CREATE INDEX IF NOT EXISTS idx_hora ON conexiones(hora);

-- Tabla de ataques detectados
CREATE TABLE IF NOT EXISTS ataques (
    id_ataque SERIAL PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    ip_origen VARCHAR(45) NULL,
    ip_destino VARCHAR(45) NULL,
    puerto INT NULL,
    fecha_detectado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    conteo_conexiones INT,
    activo BOOLEAN DEFAULT TRUE
);

-- Índices para ataques
CREATE INDEX IF NOT EXISTS idx_ip_origen ON ataques(ip_origen);
CREATE INDEX IF NOT EXISTS idx_ip_destino ON ataques(ip_destino);
CREATE INDEX IF NOT EXISTS idx_fecha_detectado ON ataques(fecha_detectado);

-- Tabla de mitigaciones aplicadas
CREATE TABLE IF NOT EXISTS mitigaciones (
    id_mitigacion SERIAL PRIMARY KEY,
    id_ataque INT NOT NULL,
    detalle TEXT NULL,
    ejecutado_por INT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_mitigacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resultado VARCHAR(100),
    CONSTRAINT fk_mitigaciones_ataque FOREIGN KEY (id_ataque)
        REFERENCES ataques(id_ataque)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_mitigaciones_usuario FOREIGN KEY (ejecutado_por)
        REFERENCES personales(id_persona)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Índices para mitigaciones
CREATE INDEX IF NOT EXISTS idx_fecha_mitigacion ON mitigaciones(fecha_mitigacion);

-- Insertar roles iniciales
INSERT INTO roles (nombre_rol) VALUES
('Administrador de red'),
('Usuario básico');

INSERT INTO personales (nombre, apellido, numero, correo, usuario, contrasena, id_rol, activo)
VALUES
('Willy', 'Condori', 73265777, 'will@gmail.com', 'will', '12345678', 1, TRUE),
('Alejandro', 'Chipana', 73265888, 'aleja@gmail.com', 'ale', '12345678', 2, TRUE);

INSERT INTO conexiones (hora, ip_src, ip_dst, port_dst, etiqueta, protocolo)
VALUES
('2025-09-28 12:00:00', '192.168.1.10', '192.168.1.1', 80, 'HTTP', 'UDP'),
('2025-09-28 12:05:00', '192.168.1.11', '192.168.1.1', 443, 'HTTPS', 'UDP');

INSERT INTO ataques (tipo, descripcion, ip_origen, ip_destino, puerto, conteo_conexiones, activo)
VALUES
('DoS', 'Ataque de denegación de servicio detectado', '192.168.1.50', '192.168.1.1', 80, 150, TRUE),
('Port Scan', 'Escaneo de puertos detectado', '192.168.1.51', '192.168.1.1', 22, 50, TRUE);

INSERT INTO mitigaciones (id_ataque, detalle, ejecutado_por, activo, resultado)
VALUES
(1, 'Bloqueo de IP en firewall', 1, TRUE, 'Éxito'),
(2, 'Notificación al administrador', 1, TRUE, 'Pendiente');