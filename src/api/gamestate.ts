import { Item } from './item';

export type GameStatus = 'LOBBY' | 'STARTING' | 'PLAYING' | 'FINISHED';

export interface GameState {
  status: GameStatus;
  startTimer: number;
  timer: number;
  loops: number;
  items: Item[];
}
