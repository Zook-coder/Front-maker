import { Spell } from './spell';
import { Item } from './item';

export type PlayerType = 'WEB' | 'UNITY';
export type PlayerRole = 'Protector' | 'Evilman' | 'Player';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  role?: PlayerRole;
  speed?: number;
  spells: Spell[];
  items: Item[];
  specialItems?: Item[];
  position?: { x: number; y: number };
  credits: number;
  blind?: boolean;
  cancelCooldown?: number;
}
