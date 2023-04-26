import { Server, Socket } from 'socket.io';

let onlineUsers: string[] = [];

export function handleStatus(socket: Socket, io: Server) {
  console.log(socket.data.username + ' connected');
  onlineUsers.push(socket.data.id);
  io.sockets.emit('statusUpdate', { onlineUsers });

  socket.on('disconnect', () => {
    console.log(socket.data.username + ' disconnected');
    onlineUsers = onlineUsers.filter((user) => user != socket.data.id);
    io.sockets.emit('statusUpdate', { onlineUsers });
  });
}
