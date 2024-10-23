import { Player } from '@/api/player';

export const PLAYER_MOCK: Player = {
  id: '1',
  name: 'John',
  type: 'WEB',
  items: [
    {
      name: 'Coin',
      type: 'COIN',
      description: 'Coin description',
      duration: 10,
      id: '1',
      coords: { x: 0, y: 0 },
    },
  ],
};

export const ONE_PLAYER_MOCK: Player[] = [{ ...PLAYER_MOCK }];

export const PLAYERS_MOCK: Player[] = [
  { ...PLAYER_MOCK },
  {
    id: '2',
    name: 'Dummy',
    type: 'UNITY',
    items: [
      {
        name: 'Coin',
        type: 'COIN',
        description: 'Coin description',
        duration: 10,
        id: '1',
        coords: { x: 0, y: 0 },
      },
    ],
  },
];
