import { Player } from '@/api/player';

export const PLAYER_MOCK: Player = {
  id: '1',
  name: 'John',
  type: 'WEB',
};

export const ONE_PLAYER_MOCK: Player[] = [{ ...PLAYER_MOCK }];
