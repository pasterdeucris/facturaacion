// socket.js
import io from 'socket.io-client';

let socket = null;

const isServerAvailable = async (url) => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error('Error al verificar el servidor:', error);
    return false;
  }
};

const initializeSocket = async (url) => {
  const serverAvailable = await isServerAvailable(url);
  if (serverAvailable) {
    socket = io(url, { transports: ['websocket'] });
    socket.on('connect', () => {
      console.log('Conectado al servidor Socket.IO');
    });
  } else {
    console.log('El puerto no está activo');
  }
};

export { socket, initializeSocket };
