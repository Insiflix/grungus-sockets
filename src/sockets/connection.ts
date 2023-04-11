import { Server, Socket } from 'socket.io';
import prisma from '../tools/prisma';
import { User } from '@prisma/client';
const socketsByChannel: { [room: string]: Socket[] } = {};

export function handleConnection(socket: Socket, io: Server) {
  // Join a room
  socket.on('join', async (room: string) => {
    console.log('user joined ' + room);
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
}
