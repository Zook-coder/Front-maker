export interface GameError {
  type: string;
  message: string;
}

export const KNOWN_ERRORS: Record<string, string> = {
  USERNAME_ALREADY_TAKEN: "Désolé, ce nom d'utilisateur est déjà utilisé.",
  GAME_ALREADY_STARTED: 'Désolé, la partie est déjà en cours.',
  UNKNOWN_PLAYER: '',
  UNAUTHORIZED: "Tu n'as pas la permission d'effectuer cette action.",
  UNITY_PLAYER_NOT_FOUND: "Le joueur sur Unity manque à l'appel",
  NOT_A_PLAYER: 'Vous ne faites pas partie de la liste de joueur.',
  ITEM_ON_COOLDOWN: "L'item est encore sous cooldown.",
  UNKNOWN_ITEM: "L'item sélectionné n'existe pas.",
  NO_ENOUGH_CREDITS: "Tu n'as pas assez de crédits pour acheter cet item !",
  NO_EVENT: "Désolé, il n'y a aucun évènement en cours",
  CANCEL_ON_COOLDOWN:
    'Vous devez attendre avant de pouvoir désactiver un piège',
  WRONG_PASSWORD: 'Le mot de passe est incorrect',
};
