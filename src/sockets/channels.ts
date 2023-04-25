import { Server, Socket } from 'socket.io';
import prisma from '../tools/prisma';
import { User } from '@prisma/client';

export function handleConnection(socket: Socket, io: Server) {
  // Join a room
  socket.on('join', async (channelId: string) => {
    console.log(socket.data.username + ' joined ' + channelId);
    joinChannel(channelId, socket.data.id, socket);
  });

  // Leave a room
  socket.on('leave', async (room: string) => {
    await socket.leave(room);
  });
}

async function joinChannel(channelId: string, userId: string, socket: Socket) {
  const channel = await prisma.channel.update({
    where: { id: channelId },
    data: {
      users: {
        connect: {
          id: userId
        }
      }
    }
  });
  socket.emit('channelJoin', {
    channelId: channel.id,
    channelName: channel.name,
    channelDesc: channel.description
  });
  await socket.join(channelId);
}
