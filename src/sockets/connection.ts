import { Server, Socket } from 'socket.io';
const socketsByRoom: { [room: string]: Socket[] } = {};

export function handleConnection(io: Server) {
  io.on('connection', (socket: Socket) => {
    // Join a room
    socket.on('join', async (room: string) => {
      console.log('user joined ' + room);
      if (socketsByRoom[room] === undefined) {
        socketsByRoom[room] = [];
      }
      socketsByRoom[room].push(socket);
      await socket.join(room);
    });

    // Leave a room
    socket.on('leave', async (room: string) => {
      if (socketsByRoom[room] !== undefined) {
        socketsByRoom[room] = socketsByRoom[room].filter((s) => s !== socket);
      }
      await socket.leave(room);
    });

    socket.on('login', async (token) => {
      if (token === undefined) {
        // TODO: check legitimacy of token
        socket.disconnect();
      }
    });
  });
}
