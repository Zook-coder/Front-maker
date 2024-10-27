import { ItemType } from './item';

export interface ShopItem {
  type: ItemType;
  name: string;
  description: string;
  cost: number;
}

export interface Shop {
  items: ShopItem[];
}
