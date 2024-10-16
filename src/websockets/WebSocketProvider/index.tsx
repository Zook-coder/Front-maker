'use client';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';

interface Context {
  socket?: Socket;
}

const WebSocketContext = createContext<Context>({
  socket: undefined,
});

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<Socket>();

  const connectWebSocketClient = () => {
    const socket = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? 'http://localhost:3001',
      {
        reconnectionDelay: 5000,
      },
    );

    socket.io.on('open', () => {
      console.log('Connected!');
    });

    socket.on('message', (message) => {
      console.log(message);
    });

    socket.io.on('close', () => {
      console.log('disconnected!');
    });

    setSocket(socket);
  };

  useEffect(() => {
    connectWebSocketClient();
    return () => {
      if (socket) socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
