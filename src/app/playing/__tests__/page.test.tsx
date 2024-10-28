import { RANDOM_NUMBER_EVENT_MOCK } from '@/testing/__fixtures__/event';
import { GAME_STATE_MOCK } from '@/testing/__fixtures__/gamestate';
import { COIN_MOCK } from '@/testing/__fixtures__/item';
import { MAP_MOCK } from '@/testing/__fixtures__/map';
import { PLAYER_MOCK, UNITY_PLAYER_MOCK } from '@/testing/__fixtures__/player';
import { SPELL_MOCK } from '@/testing/__fixtures__/spell';
import { renderPage, serverSocket, socket, user } from '@/testing/utils';
import { screen, waitFor } from '@testing-library/dom';
import { redirect } from 'next/navigation';
import PlayingPage from '../page';

describe('<PlayingPage />', () => {
  it('should render successfully', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));
    serverSocket.emit(
      'playerInfo',
      JSON.stringify({ ...PLAYER_MOCK, role: 'Protector', cancelCooldown: 10 }),
    );

    serverSocket.emit('newplayer', JSON.stringify([UNITY_PLAYER_MOCK]));
    serverSocket.emit('gamestate', JSON.stringify(GAME_STATE_MOCK));

    await waitFor(() => {
      expect(screen.getByText('J')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Protector')).toBeInTheDocument();

      expect(screen.getByText('Lancer un sort')).toBeInTheDocument();

      expect(screen.getByText('Statut de jeu')).toBeInTheDocument();

      expect(screen.getByText('Temps de jeu')).toBeInTheDocument();
      expect(screen.getByText('00:00')).toBeInTheDocument();

      expect(screen.getByText('Annulation de piège dans')).toBeInTheDocument();
      expect(screen.getByText('00:10')).toBeInTheDocument();

      expect(screen.getByText('Joueurs connectés')).toBeInTheDocument();
      expect(screen.getByText('D')).toBeInTheDocument();
      expect(screen.getByText('Dummy')).toBeInTheDocument();
      expect(screen.getByText('Unity')).toBeInTheDocument();

      expect(screen.getByText('Statut de jeu')).toBeInTheDocument();
      expect(screen.getByText('Boucles')).toBeInTheDocument();
      expect(screen.getAllByText('0')).toHaveLength(2);
    });
  });

  it('should open spells sheet when cast spell button is clicked', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit(
      'playerInfo',
      JSON.stringify({
        ...PLAYER_MOCK,
        role: 'Protector',
        spells: [SPELL_MOCK],
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('Lancer un sort')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Lancer un sort'));

    await waitFor(() => {
      expect(screen.getByText('Manuel des sorts')).toBeInTheDocument();
      expect(screen.getByText('Slow Mode')).toBeInTheDocument();
      expect(screen.getByText('Ralentissement')).toBeInTheDocument();
      expect(screen.getByText('Durée: 10s')).toBeInTheDocument();
      expect(screen.getByText('SlowMode description')).toBeInTheDocument();
      expect(screen.getByText('Prêt')).toBeInTheDocument();
    });
  });

  it('should emit cast:spell message when clicking on a ready spell', async () => {
    const emitSpy = jest.spyOn(socket, 'emit');
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));
    serverSocket.emit(
      'playerInfo',
      JSON.stringify({
        ...PLAYER_MOCK,
        role: 'Protector',
        spells: [{ ...SPELL_MOCK, currentCooldown: 0 }],
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('Lancer un sort')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Lancer un sort'));

    await waitFor(() => {
      expect(screen.getByText('Slow Mode')).toBeInTheDocument();
      expect(screen.getByText('Prêt')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Prêt'));
    expect(emitSpy).toHaveBeenCalledWith(
      'cast:spell',
      JSON.stringify({ playerId: '1', id: 0 }),
    );
  });

  it('should open spells sheet when cast spell button is clicked', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit(
      'playerInfo',
      JSON.stringify({
        ...PLAYER_MOCK,
        role: 'Protector',
        spells: [{ ...SPELL_MOCK, currentCooldown: 10 }],
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('Lancer un sort')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Lancer un sort'));

    await waitFor(() => {
      expect(screen.getByText('Manuel des sorts')).toBeInTheDocument();
      expect(screen.getByText('Slow Mode')).toBeInTheDocument();
      expect(screen.getByText('Ralentissement')).toBeInTheDocument();
      expect(screen.getByText('Durée: 10s')).toBeInTheDocument();
      expect(screen.getByText('SlowMode description')).toBeInTheDocument();
      expect(screen.getByText('00:10')).toBeInTheDocument();
      expect(screen.getByText('00:10')).toBeDisabled();
    });
  });

  it('should open attack dialog when tile is pressed', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit('gamestate', JSON.stringify(GAME_STATE_MOCK));
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));
    serverSocket.emit('playerInfo', JSON.stringify(PLAYER_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('0-0')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('0-0'));

    await waitFor(() => {
      expect(screen.getByText("Tu l'entends ce bruit ?")).toBeInTheDocument();
      expect(screen.getByText('Piéger la case')).toBeInTheDocument();
      expect(screen.getByText('Sélectionnez un item')).toBeInTheDocument();
    });
  });

  it('should mark trapped tiles according to the game state', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit(
      'gamestate',
      JSON.stringify({ ...GAME_STATE_MOCK, items: [COIN_MOCK] }),
    );
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('3-0')).toHaveStyle({
        background: 'rgb(255, 239, 0)',
      });
    });
  });

  it('should toast when trying to click tile if not a player', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit(
      'gamestate',
      JSON.stringify({ ...GAME_STATE_MOCK, items: [COIN_MOCK] }),
    );
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('3-0')).toHaveStyle({
        background: 'rgb(255, 239, 0)',
      });
    });
    await user.click(screen.getByTestId('3-0'));

    expect(screen.getByText('Oops...')).toBeInTheDocument();
    expect(
      screen.getByText('Il faut être un joueur pour déclencher des pièges'),
    ).toBeInTheDocument();
  });

  it('should toast when trying to click on a not allowed tile', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit('playerInfo', JSON.stringify(PLAYER_MOCK));

    serverSocket.emit(
      'gamestate',
      JSON.stringify({ ...GAME_STATE_MOCK, items: [COIN_MOCK] }),
    );
    serverSocket.emit(
      'map',
      JSON.stringify({
        map: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('3-0')).toHaveStyle({
        background: 'rgb(255, 239, 0)',
      });
    });
    await user.click(screen.getByTestId('3-0'));
    expect(screen.getByText('Oops...')).toBeInTheDocument();
    expect(
      screen.getByText("Cette case ne peut pas recevoir d'items."),
    ).toBeInTheDocument();
  });

  it('should open/close trap popover when clicking on a marked tile', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit(
      'gamestate',
      JSON.stringify({ ...GAME_STATE_MOCK, items: [COIN_MOCK] }),
    );
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));
    serverSocket.emit(
      'playerInfo',
      JSON.stringify({ ...PLAYER_MOCK, name: 'Dummy' }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('3-0')).toHaveStyle({
        background: 'rgb(255, 239, 0)',
      });
    });

    await user.click(screen.getByTestId('3-0'));
    expect(screen.getByText('Case piégée')).toBeInTheDocument();
    expect(screen.getByText('00:10')).toBeInTheDocument();
    expect(screen.getByText('Posé par')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Piège')).toBeInTheDocument();
    expect(screen.getByText('Coin')).toBeInTheDocument();
    expect(screen.getByText('Coordonnées')).toBeInTheDocument();
    expect(screen.getByText('(0,0)')).toBeInTheDocument();
    expect(screen.getByText('Annuler le piège')).toBeInTheDocument();

    await user.click(screen.getByTestId('close-trappopover'));
    expect(screen.queryByText('Case piégée')).not.toBeInTheDocument();
  });

  it('should open/close trap popover when clicking on a marked tile even if item has no owner', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit(
      'gamestate',
      JSON.stringify({
        ...GAME_STATE_MOCK,
        items: [{ ...COIN_MOCK, owner: undefined }],
      }),
    );
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));
    serverSocket.emit(
      'playerInfo',
      JSON.stringify({ ...PLAYER_MOCK, name: 'Dummy' }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('3-0')).toHaveStyle({
        background: 'rgb(255, 239, 0)',
      });
    });

    await user.click(screen.getByTestId('3-0'));
    expect(screen.getByText('Case piégée')).toBeInTheDocument();
    expect(screen.getByText('00:10')).toBeInTheDocument();
    expect(screen.getByText('Posé par')).toBeInTheDocument();
    expect(screen.getByText('Système')).toBeInTheDocument();
    expect(screen.getByText('Piège')).toBeInTheDocument();
    expect(screen.getByText('Coin')).toBeInTheDocument();
    expect(screen.getByText('Coordonnées')).toBeInTheDocument();
    expect(screen.getByText('(0,0)')).toBeInTheDocument();
    expect(screen.getByText('Annuler le piège')).toBeInTheDocument();

    await user.click(screen.getByTestId('close-trappopover'));
    expect(screen.queryByText('Case piégée')).not.toBeInTheDocument();
  });

  it('should open/close trap popover when clicking on a marked tile', async () => {
    renderPage(<PlayingPage />);
    const emitSpy = jest.spyOn(socket, 'emit');
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit(
      'gamestate',
      JSON.stringify({ ...GAME_STATE_MOCK, items: [COIN_MOCK] }),
    );
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));
    serverSocket.emit('playerInfo', JSON.stringify(PLAYER_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('3-0')).toHaveStyle({
        background: 'rgb(255, 239, 0)',
      });
    });

    await user.click(screen.getByTestId('3-0'));

    expect(screen.getByText('Case piégée')).toBeInTheDocument();
    await user.click(screen.getByText('Annuler le piège'));

    expect(emitSpy).toHaveBeenCalledWith(
      'item:cancel',
      JSON.stringify({
        itemId: '1',
        id: '1',
        row: 0,
        col: 0,
      }),
    );
  });

  it('should show restart button if dev mode is enabled', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit('devmode', JSON.stringify({ dev: true }));

    await waitFor(() => {
      expect(screen.getByText('Relancer la partie')).toBeInTheDocument();
    });
  });

  it('should restart the game if the restart button is pressed', async () => {
    const emitSpy = jest.spyOn(socket, 'emit');
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit('devmode', JSON.stringify({ dev: true }));

    await waitFor(() => {
      expect(screen.getByText('Relancer la partie')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Relancer la partie'));

    expect(screen.getByText('Êtes-vous sûr ?')).toBeInTheDocument();

    await user.click(screen.getByText('Continuer'));

    expect(emitSpy).toHaveBeenCalledWith('restart', undefined);
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it("should mark unity player's position on the grid", async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit('gamestate', JSON.stringify(GAME_STATE_MOCK));
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));
    serverSocket.emit('player:unity', JSON.stringify(UNITY_PLAYER_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('3-0')).toBeInTheDocument();
      expect(screen.getByTestId('3-0')).toHaveStyle({ background: 'purple' });
    });
  });

  it('should open finished dialog if the gamestate stautus is FINISHED and redirect if game state change', async () => {
    renderPage(<PlayingPage />);

    serverSocket.emit(
      'gamestate',
      JSON.stringify({ ...GAME_STATE_MOCK, status: 'FINISHED' }),
    );

    await waitFor(() => {
      expect(screen.getByText('Fin de partie !')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Le timer a atteint 0 secondes, la partie est finie vous allez être redirigé dans 00:05.',
        ),
      );
    });

    serverSocket.emit(
      'gamestate',
      JSON.stringify({ ...GAME_STATE_MOCK, finishedTimer: 0, status: 'LOBBY' }),
    );

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/');
    });
  });

  it('should render random number event drawer if the current event is the right event', async () => {
    renderPage(<PlayingPage />);
    serverSocket.emit(
      'gamestate',
      JSON.stringify({
        ...GAME_STATE_MOCK,
        currentEvent: RANDOM_NUMBER_EVENT_MOCK,
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('Un nouvel évènement !')).toBeInTheDocument();
      expect(
        screen.getByText('Choisis un nombre entre 0 et 100'),
      ).toBeInTheDocument();
      expect(screen.getByText('00:10')).toBeInTheDocument();
      expect(screen.getByText('Temps restant')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Saisissez un nombre entre 1 et 100'),
      ).toBeInTheDocument();
      expect(screen.getByText('Soumettre')).toBeInTheDocument();
    });
  });

  it('should submit to the server the provided number', async () => {
    const emitSpy = jest.spyOn(socket, 'emit');
    renderPage(<PlayingPage />);
    serverSocket.emit('playerInfo', JSON.stringify({ ...PLAYER_MOCK }));
    serverSocket.emit(
      'gamestate',
      JSON.stringify({
        ...GAME_STATE_MOCK,
        currentEvent: RANDOM_NUMBER_EVENT_MOCK,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Saisissez un nombre entre 1 et 100'),
      ).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText('Saisissez un nombre entre 1 et 100'),
      '41',
    );
    await user.click(screen.getByText('Soumettre'));
    expect(emitSpy).toHaveBeenCalledWith(
      'event:submit',
      JSON.stringify({
        id: '1',
        response: 41,
      }),
    );
    serverSocket.emit('event:submit:success', undefined);
    await waitFor(() => {
      expect(screen.getByText('Reçu 5/5')).toBeInTheDocument();
      expect(
        screen.getByText('Votre réponse a été soumise avec succès.'),
      ).toBeInTheDocument();
      expect(screen.getByText('Soumettre')).toBeDisabled();
    });
  });

  it('should show blind dialog if the player is blind', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit(
      'playerInfo',
      JSON.stringify({ ...PLAYER_MOCK, blind: true }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Vous avez été rendu inactif par l'équipe adverse !"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Vous ne pouvez plus effectuer d'action tant que le sort est actif.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Je comprends')).toBeInTheDocument();
    });
  });
});
