'use client';
import { GameState } from '@/api/gamestate';
import { Player } from '@/api/player';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';

interface Context {
  socket?: Socket;
  gameState: GameState;
  players: Player[];
  player?: Player;
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
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
  isLoading: false,
  setLoading: () => {},
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
  const [isLoading, setLoading] = useState(false);
  const [player, setPlayer] = useState<Player>();

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

    socket.on('signupsuccess', (message) => {
      const player: Player = JSON.parse(message);
      setPlayer(player);
    });

    socket.on('newplayer', (message) => {
      const players: Player[] = JSON.parse(message);
      setPlayers(players);
      setLoading(false);
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
    <WebSocketContext.Provider
      value={{
        socket,
        gameState,
        player,
        players,
        isLoading,
        setLoading,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
