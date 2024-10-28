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

export const itemDescriptionMap: Record<string, string> = {
  COIN: 'Une pièce qui donne de la vitesse au joueur',
  WALL: 'Pose de manière instantanée un mur sur la carte',
  BOMB: 'Pose une bombe qui explose au contact et réinitialise la position du joueur',
};
