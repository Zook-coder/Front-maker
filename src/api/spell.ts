export interface Spell {
  id: number;
  name: string;
  cooldown: number;
  description: string;
  duration?: number;
  active: boolean;
  timer?: number;
  currentCooldown: number;
  type: string;
}
