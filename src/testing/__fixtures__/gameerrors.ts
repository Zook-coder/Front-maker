import { GameError } from '@/api/gameerror';

export const UNKNOWN_PLAYER_ERROR_MOCK: GameError = {
  type: 'UNKNOWN_PLAYER',
  message: '',
};

export const USERNAME_ALREADY_TAKEN_ERROR_MOCK: GameError = {
  type: 'USERNAME_ALREADY_TAKEN',
  message: "Désolé, ce nom d'utilisateur est déjà utilisé.",
};
