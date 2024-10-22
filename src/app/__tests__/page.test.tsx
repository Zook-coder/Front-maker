import { cleanup } from '@/__mocks__/socket.io-client';
import {
  ONE_PLAYER_MOCK,
  PLAYER_MOCK,
  PLAYERS_MOCK,
} from '@/testing/__fixtures__/player';
import { renderPage, serverSocket, socket, user } from '@/testing/utils';
import { screen, waitFor } from '@testing-library/react';
import { redirect } from 'next/navigation';
import Lobby from '../page';

describe('<Lobby />', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render successfully', async () => {
    renderPage(<Lobby />);

    serverSocket.emit('lobbyplayers', JSON.stringify(PLAYERS_MOCK));

    await waitFor(() => {
      expect(screen.getByText('Choisir votre pseudo')).toBeInTheDocument();
      expect(
        screen.getByText(
          "Ce pseudo fera office de nom d'affichage lors de la partie.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Boucle d'or")).toBeInTheDocument();
      expect(screen.getByText('Envoyer')).toBeInTheDocument();
      expect(screen.getByText('Joueur connectés')).toBeInTheDocument();

      expect(screen.getByText('J')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Web')).toBeInTheDocument();

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(screen.getByText('Dummy')).toBeInTheDocument();
      expect(screen.getByText('Unity')).toBeInTheDocument();
    });
  });

  it('should add a new player on the lobby when send button is pressed', async () => {
    const emitSpy = jest.spyOn(socket, 'emit');
    renderPage(<Lobby />);

    await user.type(screen.getByPlaceholderText("Boucle d'or"), 'Dummy');
    await user.click(screen.getByText('Envoyer'));

    expect(emitSpy).toHaveBeenCalledWith(
      'signup',
      JSON.stringify({ name: 'Dummy', type: 'WEB' }),
    );

    serverSocket.emit(
      'newplayer',
      JSON.stringify([{ ...PLAYER_MOCK, name: 'Dummy' }]),
    );

    await waitFor(() => {
      expect(screen.getByText('D')).toBeInTheDocument();
      expect(screen.getByText('Dummy')).toBeInTheDocument();
      expect(screen.getByText('Web')).toBeInTheDocument();

      expect(screen.getByText('Un nouvel arrivant !')).toBeInTheDocument();
      expect(screen.getByText('Dummy a rejoint la partie')).toBeInTheDocument();
    });
  });

  it('should log in user if he is a known user in the server', async () => {
    renderPage(<Lobby />);

    serverSocket.emit(
      'playerInfo',
      JSON.stringify({
        id: '1',
        name: 'Dummy',
        type: 'WEB',
      }),
    );

    serverSocket.emit(
      'lobbyplayers',
      JSON.stringify([{ ...PLAYER_MOCK, name: 'Dummy' }]),
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Dummy')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Dummy')).toBeDisabled();
      expect(screen.getByText('Envoyer')).toBeDisabled();

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(screen.getByText('Dummy')).toBeInTheDocument();
      expect(screen.getByText('Web')).toBeInTheDocument();
    });
  });

  it('should allow log out if player is logged in', async () => {
    const emitSpy = jest.spyOn(socket, 'emit');
    renderPage(<Lobby />);

    serverSocket.emit(
      'playerInfo',
      JSON.stringify({
        id: '1',
        name: 'Dummy',
        type: 'WEB',
      }),
    );

    serverSocket.emit(
      'lobbyplayers',
      JSON.stringify([{ ...PLAYER_MOCK, name: 'Dummy' }]),
    );

    await waitFor(() => {
      expect(screen.getByText('Dummy')).toBeInTheDocument();
      expect(screen.getByText('Quitter')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Quitter'));

    expect(emitSpy).toHaveBeenCalledWith(
      'logout',
      JSON.stringify({
        id: '1',
      }),
    );
    serverSocket.emit('lobbyplayers', JSON.stringify([]));
    await waitFor(() => {
      expect(screen.queryByText('Dummy')).not.toBeInTheDocument();
    });
  });

  it('should toast an error on signup if username is already taken', async () => {
    serverSocket.emit(
      'lobbyplayers',
      JSON.stringify([{ ...PLAYER_MOCK, name: 'Dummy' }]),
    );

    renderPage(<Lobby />);

    await user.type(screen.getByPlaceholderText("Boucle d'or"), 'Dummy');
    await user.click(screen.getByText('Envoyer'));

    serverSocket.emit(
      'error',
      JSON.stringify({
        type: 'USERNAME_ALREADY_TAKEN',
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('Oops...')).toBeInTheDocument();
      expect(
        screen.getByText("Désolé, ce nom d'utilisateur est déjà utilisé."),
      ).toBeInTheDocument();
    });
  });

  it('should enable signup button on singupfailed', async () => {
    renderPage(<Lobby />);
    serverSocket.emit('signupfailed', undefined);

    await waitFor(() => {
      expect(screen.getByText('Envoyer')).toBeEnabled();
    });
  });

  it('should start a timer when the start button is pressed and redirect to playing', async () => {
    const emitSpy = jest.spyOn(socket, 'emit');
    renderPage(<Lobby />);

    serverSocket.emit('playerInfo', JSON.stringify(PLAYER_MOCK));
    await user.click(screen.getByText('Lancer la partie'));

    expect(emitSpy).toHaveBeenCalledWith(
      'start',
      JSON.stringify({
        id: '1',
      }),
    );

    serverSocket.emit(
      'start',
      JSON.stringify({
        id: '1',
      }),
    );

    serverSocket.emit(
      'gamestate',
      JSON.stringify({
        loops: 0,
        startTimer: 5,
        status: 'STARTING',
        timer: 0,
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('Préparez-vous !')).toBeInTheDocument();
      expect(screen.getByText('00:05')).toBeInTheDocument();
    });

    serverSocket.emit(
      'gamestate',
      JSON.stringify({
        loops: 0,
        startTimer: 0,
        status: 'PLAYING',
        timer: 0,
      }),
    );

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/playing');
    });
  });

  it('should toast when a player disconnect', async () => {
    renderPage(<Lobby />);

    serverSocket.emit('newplayer', JSON.stringify(ONE_PLAYER_MOCK));

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    serverSocket.emit(
      'logoutplayer',
      JSON.stringify({
        logoutPlayer: {
          id: '1',
          name: 'John',
          type: 'WEB',
        },
        players: [],
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Ce n'est qu'un au revoir..."),
      ).toBeInTheDocument();
      expect(screen.getByText('John a quitté la partie')).toBeInTheDocument();
    });
  });

  it('should set playerId in local storage on signupsuccess', async () => {
    renderPage(<Lobby />);

    serverSocket.emit('signupsuccess', JSON.stringify(PLAYER_MOCK));

    await waitFor(() => {
      expect(localStorage.getItem('playerId')).toEqual('1');
    });
  });
});
