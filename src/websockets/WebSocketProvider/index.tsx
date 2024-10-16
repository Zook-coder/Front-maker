'use client';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Context {
  socket?: WebSocket;
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
  const [socket, setSocket] = useState<WebSocket>();

  const connectWebSocketClient = useCallback(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? 'ws://localhost:3000',
    );
    setSocket(ws);

    ws.onmessage = (e) => {
      const data = JSON.parse((e.data as Buffer).toString());
      console.log(data);
    };

    ws.onclose = () => {
      console.log('Connexion perdue... Tentative de reconnexion.');
      setTimeout(() => {
        connectWebSocketClient();
      }, 5000);
    };

    ws.onopen = () => {
      console.log('Connected!');
    };

    setSocket(ws);
  }, []);

  useEffect(() => {
    connectWebSocketClient();
    return () => {
      if (socket) socket.close();
    };
  }, [connectWebSocketClient]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
