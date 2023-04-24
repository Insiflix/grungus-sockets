import { Server, Socket } from 'socket.io';
import prisma from '../tools/prisma';
import generateId from '../tools/helpers';

export function handleMessage(socket: Socket, io: Server) {
  // Send a message to a room
  socket.on('message', async (data: { channel: string; content: any }) => {
    console.log('message' + data.content + ' - ' + data.channel);
    const message = await prisma.message.create({
      data: {
        text: data.content,
        user: { connect: { id: socket.data.id } },
        channel: { connect: { id: data.channel } },
        id: generateId()
      }
    });
    const outMessage = {
      authorId: socket.data.identifier,
      authorName: socket.data.username,
      content: message.text,
      id: message.id,
      channelId: message.channelId,
      createdAt: message.createdAt
    };
    io.to(data.channel.toString()).emit('message', outMessage);
    console.log(socket.data);
  });
}
