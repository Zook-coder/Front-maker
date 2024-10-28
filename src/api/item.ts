import { Player } from './player';

export type ItemType = 'COIN' | 'FREEZE' | 'BOMB';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  duration?: number;
  durationLength?: number;
  description: string;
  coords: { x: number; y: number };
  owner: Player;
  currentCooldown: number;
  password?: string;
}
