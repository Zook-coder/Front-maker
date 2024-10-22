import { Player } from '@/api/player';

export const PLAYER_MOCK: Player = {
  id: '1',
  name: 'John',
  type: 'WEB',
};

export const ONE_PLAYER_MOCK: Player[] = [{ ...PLAYER_MOCK }];

export const PLAYERS_MOCK: Player[] = [
  { ...PLAYER_MOCK },
  {
    id: '2',
    name: 'Dummy',
    type: 'UNITY',
  },
];
