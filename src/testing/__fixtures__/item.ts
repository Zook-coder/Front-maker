import { Item } from '@/api/item';
import { PLAYER_MOCK } from './player';

export const COIN_MOCK: Item = {
  type: 'COIN',
  name: 'Coin',
  description: 'A coin',
  coords: { x: 0, y: 0 },
  id: '1',
  duration: 1,
  owner: {
    ...PLAYER_MOCK,
  },
};
