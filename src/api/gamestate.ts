import { Item } from './item';

export type GameStatus = 'LOBBY' | 'STARTING' | 'PLAYING' | 'FINISHED';

export interface GameState {
  status: GameStatus;
  startTimer: number;
  finishedTimer: number;
  timer: number;
  loops: number;
  items: Item[];
}
