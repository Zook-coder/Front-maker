import { GAME_STATE_MOCK } from '@/testing/__fixtures__/gamestate';
import { PLAYER_MOCK } from '@/testing/__fixtures__/player';
import { renderPage, serverSocket, socket, user } from '@/testing/utils';
import { screen, waitFor } from '@testing-library/dom';
import PlayingPage from '../page';

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
      JSON.stringify({ ...PLAYER_MOCK, role: 'Protector' }),
    );

    await waitFor(() => {
      expect(screen.getByText('Lancer un sort')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Lancer un sort'));

    await waitFor(() => {
      expect(screen.getByText('Manuel des sorts')).toBeInTheDocument();
    });
  });

  it('should open attack dialog when tile is pressed', async () => {
    renderPage(<PlayingPage />);
    serverSocket.emit('gamestate', JSON.stringify(GAME_STATE_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('0-0')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('0-0'));

    await waitFor(() => {
      expect(screen.getByText("Tu l'entends ce bruit ?")).toBeInTheDocument();
      expect(screen.getAllByText('TENEBRES')).toHaveLength(2);

      expect(screen.getByText('Piéger la case')).toBeInTheDocument();
    });
  });

  it('should send the trap request when clicking the submit button in the attack dialog', async () => {
    const emitSpy = jest.spyOn(socket, 'emit');
    renderPage(<PlayingPage />);
    serverSocket.emit('playerInfo', JSON.stringify(PLAYER_MOCK));
    serverSocket.emit('gamestate', JSON.stringify(GAME_STATE_MOCK));

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
          x: 0,
          y: 0,
          item: 'TENEBRES',
        }),
      );
    });
  });
});
