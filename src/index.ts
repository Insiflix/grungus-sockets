import { Server, Socket } from 'socket.io';
import { handleConnection } from './sockets/connection';
import { handleMessage } from './sockets/message';
import prisma from './tools/prisma';

const io = new Server();
io.on('connection', async (socket: Socket) => {
  const user = await prisma.user.findFirst({
    where: { token: socket.handshake.query.token?.toString() }
  });
  if (user === null) {
    socket.disconnect();
    return;
  }
  socket.data.username = user.username;
  socket.data.id = user.id;
  socket.data.identifier = user.identifier;

  handleConnection(socket, io);
  handleMessage(socket, io);
});
io.listen(3000, undefined);
