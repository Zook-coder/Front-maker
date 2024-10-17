export interface GameError {
  type: string;
  message: string;
}

export const KNOWN_ERRORS: Record<string, string> = {
  USERNAME_ALREADY_TAKEN: "Désolé, ce nom d'utilisateur est déjà utilisé.",
  GAME_ALREADY_STARTED: 'Désolé, la partie est déjà en cours.',
  UNKNOWN_PLAYER: '',
};
