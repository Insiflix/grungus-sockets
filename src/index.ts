import { Server, Socket } from 'socket.io';
import { handleConnection } from './sockets/channels';
import { handleMessage } from './sockets/message';
import prisma from './tools/prisma';
import { handleStatus } from './sockets/status';

const io = new Server({
  cors: {
    origin: 'http://localhost:5173'
  }
});
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
  const channels = await prisma.channel.findMany({
    where: { users: { some: { id: user.id } } }
  });
  channels.forEach((c) => {
    socket.join(c.id);
    socket.emit('channelJoin', {
      channelId: c.id,
      channelName: c.name,
      channelDesc: c.description
    });
  });
  handleConnection(socket, io);
  handleMessage(socket, io);
  handleStatus(socket, io);
});
io.listen(5000, undefined);
