import { GAME_STATE_MOCK } from '@/testing/__fixtures__/gamestate';
import { PLAYER_MOCK, UNITY_PLAYER_MOCK } from '@/testing/__fixtures__/player';
import { SPELL_MOCK } from '@/testing/__fixtures__/spell';
import { renderPage, serverSocket, socket, user } from '@/testing/utils';
import { screen, waitFor } from '@testing-library/dom';
import PlayingPage from '../page';
import { MAP_MOCK } from '@/testing/__fixtures__/map';
import { COIN_MOCK } from '@/testing/__fixtures__/item';
import { redirect } from 'next/navigation';

describe('<PlayingPage />', () => {
  it('should render successfully', async () => {
    renderPage(<PlayingPage />);
    serverSocket.emit(
      'playerInfo',
      JSON.stringify({ ...PLAYER_MOCK, role: 'Protector' }),
    );

    serverSocket.emit('gamestate', JSON.stringify(GAME_STATE_MOCK));

    await waitFor(() => {
      expect(screen.getByText('J')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Protector')).toBeInTheDocument();

      expect(screen.getByText('Lancer un sort')).toBeInTheDocument();

      expect(screen.getByText('Statut de jeu')).toBeInTheDocument();
      expect(screen.getByText('00:00')).toBeInTheDocument();
      expect(screen.getByText('Statistiques globales')).toBeInTheDocument();

      expect(screen.getByText('Statut de jeu')).toBeInTheDocument();
      expect(screen.getAllByText('Nombre de boucles')).toHaveLength(3);

      expect(screen.getAllByText('Bonus utilisés')).toHaveLength(2);
    });
  });

  it('should open spells sheet when cast spell button is clicked', async () => {
    renderPage(<PlayingPage />);
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

  it('should open spells sheet when cast spell button is clicked', async () => {
    renderPage(<PlayingPage />);
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
    });
  });

  it('should open attack dialog when tile is pressed', async () => {
    renderPage(<PlayingPage />);
    serverSocket.emit('gamestate', JSON.stringify(GAME_STATE_MOCK));
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));
    serverSocket.emit('playerInfo', JSON.stringify(PLAYER_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('0-0')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('0-0'));

    await waitFor(() => {
      expect(screen.getByText("Tu l'entends ce bruit ?")).toBeInTheDocument();
      expect(screen.getAllByText('Coin')).toHaveLength(2);

      expect(screen.getByText('Piéger la case')).toBeInTheDocument();
      expect(
        screen.getByText('A coin that gives points to the player'),
      ).toBeInTheDocument();
    });
  });

  it('should send the trap request when clicking the submit button in the attack dialog', async () => {
    const emitSpy = jest.spyOn(socket, 'emit');
    renderPage(<PlayingPage />);
    serverSocket.emit('playerInfo', JSON.stringify(PLAYER_MOCK));
    serverSocket.emit('gamestate', JSON.stringify(GAME_STATE_MOCK));
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('0-0')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('0-0'));
    await user.click(screen.getByText('Piéger la case'));
    await waitFor(() => {
      expect(emitSpy).toHaveBeenCalledWith(
        'cast:item',
        JSON.stringify({
          id: '1',
          x: 3,
          y: 0,
          item: 'COIN',
        }),
      );
    });
  });

  it('should mark trapped tiles according to the game state', async () => {
    renderPage(<PlayingPage />);

    serverSocket.emit(
      'gamestate',
      JSON.stringify({ ...GAME_STATE_MOCK, items: [COIN_MOCK] }),
    );
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('3-0')).toHaveStyle({ background: 'red' });
    });
  });

  it('should open/close trap popover when clicking on a marked tile', async () => {
    renderPage(<PlayingPage />);

    serverSocket.emit(
      'gamestate',
      JSON.stringify({ ...GAME_STATE_MOCK, items: [COIN_MOCK] }),
    );
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('3-0')).toHaveStyle({ background: 'red' });
    });

    await user.click(screen.getByTestId('3-0'));

    expect(screen.getByText('Case piégée')).toBeInTheDocument();
    expect(screen.getByText('00:01')).toBeInTheDocument();
    expect(screen.getByText('Posé par')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Piège')).toBeInTheDocument();
    expect(screen.getByText('Coin')).toBeInTheDocument();
    expect(screen.getByText('Annuler')).toBeInTheDocument();

    await user.click(screen.getByTestId('3-0'));
    expect(screen.queryByText('Case piégée')).not.toBeInTheDocument();
  });

  it('should show restart button if dev mode is enabled', async () => {
    renderPage(<PlayingPage />);

    serverSocket.emit('devmode', JSON.stringify({ dev: true }));

    await waitFor(() => {
      expect(screen.getByText('Relancer la partie')).toBeInTheDocument();
    });
  });

  it('should restart the game if the restart button is pressed', async () => {
    const emitSpy = jest.spyOn(socket, 'emit');
    renderPage(<PlayingPage />);

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
      JSON.stringify({ ...GAME_STATE_MOCK, status: 'LOBBY' }),
    );

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/');
    });
  });
});
