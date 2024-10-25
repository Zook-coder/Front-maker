import { GameState } from '@/api/gamestate';

export const GAME_STATE_MOCK: GameState = {
  loops: 0,
  status: 'PLAYING',
  finishedTimer: 5,
  startTimer: 0,
  timer: 0,
  items: [],
  eventTimer: 5,
};
