let socket = null;
let listeners = [];

export const conectarTraffic = () => {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    console.log("⏳ WebSocket ya está conectado o en conexión...");
    return;
  }

  console.log("🔌 Conectando WebSocket monitoreo...");
  socket = new WebSocket("ws://localhost:8000/ws/monitoreo/");

  socket.onopen = () => {
    console.log("✅ WebSocket conectado al monitoreo");
  };

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    listeners.forEach((cb) => cb(msg));
  };

  socket.onerror = (err) => {
    console.error("❌ Error en WebSocket:", err);
  };

  socket.onclose = () => {
    console.warn("⚠️ WebSocket cerrado, reconectando en 10s…");
    socket = null;
    setTimeout(() => conectarTraffic(), 10000);
  };
};

export const escucharMensajes = (callback) => {
  console.log("👂 Registrando callback escucharMensajes");
  listeners.push(callback);
};

export const cerrarTraffic = () => {
  if (socket) {
    console.log("❌ Cerrando WebSocket manualmente…");
    socket.close(1000, "Component unmounted");
    socket = null;
  }
  listeners = [];
};
