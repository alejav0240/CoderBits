let socket = null;

export function conectarTraffic() {
  socket = new WebSocket("ws://localhost:8000/ws/conexiones/");
}

export function enviarMensaje(data) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

export function escucharMensajes(callback) {
  if (!socket) return;
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callback(data);
  };
}

export function cerrarTraffic() {
  if (socket) {
    socket.close();
    socket = null;
  }
}
