import MockComponent from '@/__mocks__/component';
import { RANDOM_NUMBER_EVENT_WIN_DATA_MOCK } from '@/testing/__fixtures__/event';
import {
  UNKNOWN_PLAYER_ERROR_MOCK,
  USERNAME_ALREADY_TAKEN_ERROR_MOCK,
} from '@/testing/__fixtures__/gameerrors';
import { COIN_MOCK } from '@/testing/__fixtures__/item';
import { PLAYER_MOCK } from '@/testing/__fixtures__/player';
import { renderPage, serverSocket, socket } from '@/testing/utils';
import { screen, waitFor } from '@testing-library/dom';

describe('<WebSocketProvider />', () => {
  it('should ask the server the map on connection', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const emitSpy = jest.spyOn(socket, 'emit');
    localStorage.setItem('playerId', '1234');
    renderPage(<MockComponent />);

    serverSocket.emit('open');

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Connected!');
      expect(emitSpy).toHaveBeenCalledWith(
        'whoami',
        JSON.stringify({ id: '1234' }),
      );
      expect(emitSpy).toHaveBeenCalledWith('maprequest', undefined);
    });
  });

  it('should ask the server the shop on connection', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const emitSpy = jest.spyOn(socket, 'emit');
    renderPage(<MockComponent />);

    serverSocket.emit('open');

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Connected!');
      expect(emitSpy).toHaveBeenCalledWith('shoprequest', undefined);
    });
  });

  it('should not ask the server who am i on connection if no local storage', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const emitSpy = jest.spyOn(socket, 'emit');
    localStorage.removeItem('playerId');
    renderPage(<MockComponent />);

    serverSocket.emit('open');

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Connected!');
      expect(emitSpy).not.toHaveBeenCalledWith(
        'whoami',
        JSON.stringify({ id: '1234' }),
      );
    });
  });

  it('should remove playerId from local storage if the player is unknown', async () => {
    localStorage.setItem('playerId', '1234');
    renderPage(<MockComponent />);

    expect(localStorage.getItem('playerId')).toEqual('1234');
    serverSocket.emit('error', JSON.stringify(UNKNOWN_PLAYER_ERROR_MOCK));

    await waitFor(() => {
      expect(localStorage.getItem('playerId')).toEqual(null);
    });
  });

  it('should handle known errors', async () => {
    renderPage(<MockComponent />);

    serverSocket.emit(
      'error',
      JSON.stringify(USERNAME_ALREADY_TAKEN_ERROR_MOCK),
    );
    await waitFor(() => {
      expect(screen.getByText('Oops...')).toBeInTheDocument();
      expect(
        screen.getByText("Désolé, ce nom d'utilisateur est déjà utilisé."),
      ).toBeInTheDocument();
    });
  });

  it('should handle unknown errors', async () => {
    renderPage(<MockComponent />);

    serverSocket.emit(
      'error',
      JSON.stringify({
        type: 'UNKNOWN_ERROR',
      }),
    );
    await waitFor(() => {
      expect(screen.getByText('Oops...')).toBeInTheDocument();
      expect(screen.getByText('Une erreur est survenue.')).toBeInTheDocument();
    });
  });

  it('should log on socket close', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    renderPage(<MockComponent />);

    serverSocket.emit('close');

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('disconnected!');
    });
  });

  it('should toast when receiving a new item', async () => {
    renderPage(<MockComponent />);

    serverSocket.emit('newitem', JSON.stringify(COIN_MOCK));

    await waitFor(() => {
      expect(
        screen.getByText('Un nouveau piège est apparu !'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('John a posé un piège sur la carte'),
      ).toBeInTheDocument();
    });
  });

  it('should toast on item cancel success', async () => {
    renderPage(<MockComponent />);
    serverSocket.emit(
      'item:cancel:success',
      JSON.stringify({ ...PLAYER_MOCK }),
    );
    await waitFor(() => {
      expect(screen.getByText('Bien reçu !')).toBeInTheDocument();
      expect(
        screen.getByText('Le piège de John a été désactivé avec succès'),
      ).toBeInTheDocument();
    });
  });

  it('should toast on item canceled', async () => {
    renderPage(<MockComponent />);
    serverSocket.emit('item:canceled', JSON.stringify({ ...PLAYER_MOCK }));
    await waitFor(() => {
      expect(screen.getByText('Attention !')).toBeInTheDocument();
      expect(
        screen.getByText('John a désactivé un de vos pièges'),
      ).toBeInTheDocument();
    });
  });

  it('should toast when an event winner is being sent', async () => {
    renderPage(<MockComponent />);
    serverSocket.emit(
      'event:winner',
      JSON.stringify({
        ...RANDOM_NUMBER_EVENT_WIN_DATA_MOCK,
        winnerTeam: 'Evilman',
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Les résultats sont tombés ! La bonne réponse était 10',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Félicitations aux Evilman(s) ! Leurs crédits ont été mis à jour.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('should toast when an event winner is being sent (equality)', async () => {
    renderPage(<MockComponent />);
    serverSocket.emit(
      'event:winner',
      JSON.stringify({
        ...RANDOM_NUMBER_EVENT_WIN_DATA_MOCK,
        winnerTeam: 'Both',
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("C'est un match nul ! La bonne réponse était 10"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Les deux équipes terminent à égalité et gagnent autant de crédits.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('should toast when there is no winner of the event', async () => {
    renderPage(<MockComponent />);
    serverSocket.emit(
      'event:winner',
      JSON.stringify({
        ...RANDOM_NUMBER_EVENT_WIN_DATA_MOCK,
        winnerTeam: 'None',
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText('Pas de réponses soumises...'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Dommage ! Les joueurs repartent les mains vides cette fois.',
        ),
      ).toBeInTheDocument();
    });
  });
});
