import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const server = new Server(httpServer);

export default server;
