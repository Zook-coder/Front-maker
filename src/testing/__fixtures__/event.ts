import { Event, RandomNumberEventWinData } from '@/api/event';

export const RANDOM_NUMBER_EVENT_MOCK: Event = {
  type: 'RANDOM_NUMBER',
  timer: 10,
  description: 'Choisis un nombre entre 0 et 100',
};

export const RANDOM_NUMBER_EVENT_WIN_DATA_MOCK: RandomNumberEventWinData = {
  randomNumber: 10,
  winnerTeam: 'Evilman',
};
