'use client';
import { RandomNumberEventWinData } from '@/api/event';
import { GameError, KNOWN_ERRORS } from '@/api/gameerror';
import { GameState } from '@/api/gamestate';
import { Item } from '@/api/item';
import { Player } from '@/api/player';
import { Query, QueryStatus } from '@/api/query';
import { ShopItem } from '@/api/shop';
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
  unityPlayer?: Player;
  map: number[][] | undefined;
  shopItems: ShopItem[];
  queries: Record<Query, QueryStatus>;
  setQueries: Dispatch<SetStateAction<Record<Query, QueryStatus>>>;
  devMode: boolean;
  resetGame: () => void;
}

const INITIAL_STATE: GameState = {
  status: 'LOBBY',
  loops: 0,
  timer: 0,
  startTimer: 0,
  finishedTimer: 5,
  eventTimer: 5,
  items: [],
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
  shopItems: [],
  devMode: false,
  resetGame: () => {},
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
  const [unityPlayer, setUnityPlayer] = useState<Player>();
  const [map, setMap] = useState<number[][]>();
  const [devMode, setDevMode] = useState(false);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
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

  const resetGame = () => {
    localStorage.removeItem('playerId');
    setPlayers([]);
    setPlayer(undefined);
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
    setMap(undefined);
  };

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
      socket?.emit('shoprequest', undefined);
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

    socket.on('shop', (message) => {
      const { items }: { items: ShopItem[] } = JSON.parse(message);
      setShopItems(items);
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

    socket.on('item:cancel:success', (message) => {
      const player: Player | undefined = JSON.parse(message);
      if (player) {
        toast({
          title: 'Bien reçu !',
          description: `Le piège de ${player.name} a été désactivé avec succès`,
        });
      }
    });

    socket.on('event:submit:success', () => {
      toast({
        title: 'Reçu 5/5',
        description: 'Votre réponse a été soumise avec succès.',
      });
    });

    socket.on('event:winner', (message) => {
      const { winnerTeam, randomNumber }: RandomNumberEventWinData =
        JSON.parse(message);

      if (winnerTeam === 'None') {
        toast({
          title: 'Pas de réponses soumises...',
          description:
            'Dommage ! Les joueurs repartent les mains vides cette fois.',
        });
        return;
      }

      toast({
        title:
          winnerTeam === 'Both'
            ? `C'est un match nul ! La bonne réponse était ${randomNumber}`
            : `Les résultats sont tombés ! La bonne réponse était ${randomNumber}`,
        description:
          winnerTeam === 'Both'
            ? 'Les deux équipes terminent à égalité et gagnent autant de crédits.'
            : `Félicitations aux ${winnerTeam}(s) ! Leurs crédits ont été mis à jour.`,
      });
    });

    socket.on('item:canceled', (msg) => {
      const player: Player = JSON.parse(msg);
      toast({
        title: 'Attention !',
        description: `${player.name} a désactivé un de vos pièges`,
      });
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

    socket.on('devmode', (msg) => {
      const { dev }: { dev: boolean } = JSON.parse(msg);
      setDevMode(dev);
    });

    socket.on('newitem', (msg) => {
      const item: Item = JSON.parse(msg);
      toast({
        title: 'Un nouveau piège est apparu !',
        description: `${item.owner.name} a posé un piège sur la carte`,
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

    socket.on('player:unity', (message) => {
      const unityPlayer: Player = JSON.parse(message);
      if (unityPlayer.position) {
        setUnityPlayer({
          ...unityPlayer,
          position: {
            x: unityPlayer.position.y,
            y: unityPlayer.position.x,
          },
        });
      }
    });

    socket.on('newplayer', (message) => {
      const players: Player[] = JSON.parse(message);
      setPlayers(players);
    });

    socket.on('signup:newplayer', (message) => {
      const player: Player = JSON.parse(message);
      toast({
        title: 'Un nouvel arrivant !',
        description: `${player.name} a rejoint la partie`,
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
        devMode,
        map,
        gameState,
        player,
        unityPlayer,
        players,
        queries,
        setQueries,
        resetGame,
        shopItems,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
