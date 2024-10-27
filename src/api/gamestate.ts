import { Event } from './event';
import { Item } from './item';

export type GameStatus =
  | 'LOBBY'
  | 'STARTING'
  | 'PLAYING'
  | 'FINISHED'
  | 'EVENT';

export interface GameState {
  status: GameStatus;
  startTimer: number;
  finishedTimer: number;
  eventTimer: number;
  currentEvent?: Event;
  timer: number;
  loops: number;
  items: Item[];
}
