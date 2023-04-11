import { Server, Socket } from 'socket.io';
const socketsByChannel: { [room: string]: Socket[] } = {};

export function handleConnection(io: Server) {
  io.on('connection', (socket: Socket) => {
    const token = socket.handshake.query.token;
    if (token === 'valid') {
      socket.data.authed = true;
    } else {
      socket.disconnect();
    }

    // Join a room
    socket.on('join', async (room: string) => {
      console.log('user joined ' + room);
      console.log(socket.id);
      if (socketsByChannel[room] === undefined) {
        socketsByChannel[room] = [];
      }
      socketsByChannel[room].push(socket);
      await socket.join(room);
    });

    // Leave a room
    socket.on('leave', async (room: string) => {
      if (socketsByChannel[room] !== undefined) {
        socketsByChannel[room] = socketsByChannel[room].filter(
          (s) => s !== socket
        );
      }
      await socket.leave(room);
    });
  });
}
