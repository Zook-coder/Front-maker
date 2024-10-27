import { Item } from '@/api/item';
import { PLAYER_MOCK } from './player';

export const COIN_MOCK: Item = {
  type: 'COIN',
  name: 'Coin',
  description: 'A coin',
  coords: { x: 0, y: 0 },
  id: '1',
  duration: 10,
  durationLength: 10,
  owner: {
    ...PLAYER_MOCK,
  },
  currentCooldown: 30,
};

export const FREEZE_ITEM_MOCK: Item = {
  type: 'FREEZE',
  name: 'Gel',
  description: "Gel l'équipe adverse pendant 5 secondes",
  coords: { x: 0, y: 0 },
  id: '2',
  duration: 10,
  durationLength: 10,
  owner: {
    ...PLAYER_MOCK,
  },
  currentCooldown: 30,
};
