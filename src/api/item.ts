export type ItemType = 'COIN';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  duration: number;
  description: string;
  coords: { x: number; y: number };
}
