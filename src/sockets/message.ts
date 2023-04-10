import { Server, Socket } from 'socket.io';

export function handleMessage(io: Server) {
  io.on('connection', (socket: Socket) => {
    // Send a message to a room
    socket.on('message', (data: { room: string; message: any }) => {
      console.log('message' + data.message + ' - ' + data.room);
      const { room, message } = data;
      io.to(room).emit('message', message);
    });
  });
}
