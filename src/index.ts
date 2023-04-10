import { Server } from 'socket.io';
import { handleConnection } from './sockets/connection';
import { handleMessage } from './sockets/message';

const io = new Server();

handleConnection(io);
handleMessage(io);

io.listen(3000, undefined);
