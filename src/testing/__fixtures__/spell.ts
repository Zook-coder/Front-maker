import { Spell } from '@/api/spell';

export const SPELL_MOCK: Spell = {
  id: 1,
  name: 'Slow Mode',
  cooldown: 30,
  description: 'SlowMode description',
  active: false,
  timer: 0,
  duration: 10,
  currentCooldown: 0,
  type: 'Ralentissement',
};
