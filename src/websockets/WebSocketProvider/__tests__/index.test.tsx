import MockComponent from '@/__mocks__/component';
import {
  UNKNOWN_PLAYER_ERROR_MOCK,
  USERNAME_ALREADY_TAKEN_ERROR_MOCK,
} from '@/testing/__fixtures__/gameerrors';
import { renderPage, serverSocket, socket } from '@/testing/utils';
import { screen, waitFor } from '@testing-library/dom';

describe('<WebSocketProvider />', () => {
  it('should ask the server who am i on connection if local storage is present', async () => {
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
});
