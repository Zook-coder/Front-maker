'use client';
import { GameError, KNOWN_ERRORS } from '@/api/gameerror';
import { GameState } from '@/api/gamestate';
import { Player } from '@/api/player';
import { Query, QueryStatus } from '@/api/query';
import { useToast } from '@/hooks/use-toast';
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
  map: number[][] | undefined;
  queries: Record<Query, QueryStatus>;
  setQueries: Dispatch<SetStateAction<Record<Query, QueryStatus>>>;
}

const INITIAL_STATE: GameState = {
  status: 'LOBBY',
  loops: 0,
  timer: 0,
  startTimer: 0,
};

const WebSocketContext = createContext<Context>({
  socket: undefined,
  gameState: INITIAL_STATE,
  map: undefined,
  players: [],
  setQueries: () => {},
  queries: {
    signup: {
      loading: false,
    },
    players: {
      loading: false,
    },
    start: {
      loading: false,
    },
  },
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
  const [player, setPlayer] = useState<Player>();
  const [map, setMap] = useState<number[][]>();
  const { toast } = useToast();
  const [queries, setQueries] = useState<Record<Query, QueryStatus>>({
    signup: {
      loading: false,
    },
    players: {
      loading: false,
    },
    start: {
      loading: false,
    },
  });

  const connectWebSocketClient = () => {
    const socket = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? 'http://localhost:3001',
      {
        reconnectionDelay: 5000,
      },
    );

    socket.io.on('open', () => {
      console.log('Connected!');
      socket?.emit('maprequest', undefined);
      const playerId = localStorage.getItem('playerId');

      if (!playerId) {
        return;
      }

      socket?.emit('whoami', JSON.stringify({ id: playerId }));
    });

    socket.on('map', (message) => {
      const { map }: { map: number[][] } = JSON.parse(message);
      setMap(map);
    });

    socket.on('error', (message) => {
      const gameError: GameError = JSON.parse(message);
      const error = KNOWN_ERRORS[gameError.type];

      if (gameError.type === 'UNKNOWN_PLAYER') {
        localStorage.removeItem('playerId');
        return;
      }

      if (error) {
        toast({
          title: 'Oops...',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Oops...',
          description: 'Une erreur est survenue.',
          variant: 'destructive',
        });
      }
      setQueries({
        signup: {
          loading: false,
        },
        players: {
          loading: false,
        },
        start: {
          loading: false,
        },
      });
    });

    socket.on('gamestate', (message) => {
      const state: GameState = JSON.parse(message);
      setGameState(state);
    });

    socket.on('signupsuccess', (message) => {
      const player: Player = JSON.parse(message);
      setPlayer(player);
      localStorage.setItem('playerId', player.id);
      setQueries({
        ...queries,
        signup: {
          loading: false,
        },
      });
    });

    socket.on('signupfailed', () => {
      setQueries({
        ...queries,
        signup: {
          loading: false,
        },
      });
    });

    socket.on('lobbyplayers', (message) => {
      const players: Player[] = JSON.parse(message);
      setPlayers(players);
    });

    socket.on('playerInfo', (message) => {
      const player: Player = JSON.parse(message);
      setPlayer(player);
    });

    socket.on('newplayer', (message) => {
      const players: Player[] = JSON.parse(message);
      const newPlayer = players[players.length - 1];
      setPlayers(players);

      toast({
        title: 'Un nouvel arrivant !',
        description: `${newPlayer.name} a rejoint la partie`,
      });
    });

    socket.on('logoutplayer', (message) => {
      const {
        players: newPlayers,
        logoutPlayer,
      }: { players: Player[]; logoutPlayer: Player } = JSON.parse(message);
      setPlayers(newPlayers);

      toast({
        title: "Ce n'est qu'un au revoir...",
        description: `${logoutPlayer.name} a quitté la partie`,
      });
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
        map,
        gameState,
        player,
        players,
        queries,
        setQueries,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
