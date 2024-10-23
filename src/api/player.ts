import { Spell } from './spell';

export type PlayerType = 'WEB' | 'UNITY';
export type PlayerRole = 'Protector' | 'Evilman' | 'Player';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  role?: PlayerRole;
  speed?: number;
  spells: Spell[];
}
