'use client';
import { GameState } from '@/models/gamestate';
import { Player } from '@/models/player';
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
  gameState: GameState;
  players: Player[];
}

const INITIAL_STATE: GameState = {
  status: 'LOBBY',
  loops: 0,
  timer: 0,
};

const WebSocketContext = createContext<Context>({
  socket: undefined,
  gameState: INITIAL_STATE,
  players: [],
});

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [socket, setSocket] = useState<Socket>();
  const [players, setPlayers] = useState<Player[]>([]);

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

    socket.on('gamestate', (message) => {
      const state: GameState = JSON.parse(message);
      setGameState(state);
    });

    socket.on('newplayer', (message) => {
      const players: Player[] = JSON.parse(message);
      setPlayers(players);
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
    <WebSocketContext.Provider value={{ socket, gameState, players }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
