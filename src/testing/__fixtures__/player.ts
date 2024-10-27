import { Player } from '@/api/player';

export const PLAYER_MOCK: Player = {
  id: '1',
  name: 'John',
  type: 'WEB',
  spells: [],
  items: [
    {
      name: 'Coin',
      type: 'COIN',
      description: 'Coin description',
      duration: 10,
      id: '1',
      coords: { x: 0, y: 0 },
      owner: {
        id: '2',
        name: 'Dummy',
        type: 'UNITY',
        spells: [],
        items: [],
        credits: 0,
      },
      cooldown: 30,
    },
  ],
  credits: 0,
};

export const ONE_PLAYER_MOCK: Player[] = [{ ...PLAYER_MOCK }];

export const UNITY_PLAYER_MOCK: Player = {
  id: '3',
  name: 'Dummy',
  type: 'UNITY',
  spells: [],
  items: [],
  position: {
    x: 0,
    y: 0,
  },
  credits: 0,
};

export const PLAYERS_MOCK: Player[] = [
  { ...PLAYER_MOCK },
  {
    id: '2',
    name: 'Dummy',
    type: 'UNITY',
    spells: [],
    items: [
      {
        name: 'Coin',
        type: 'COIN',
        description: 'Coin description',
        duration: 10,
        id: '1',
        coords: { x: 0, y: 0 },
        owner: { ...PLAYER_MOCK },
        cooldown: 30,
      },
    ],
    credits: 0,
  },
];
