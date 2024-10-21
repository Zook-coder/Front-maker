import { GameState } from '@/api/gamestate';

export const GAME_STATE_MOCK: GameState = {
  loops: 0,
  status: 'PLAYING',
  startTimer: 0,
  timer: 0,
  map: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};
