import { GAME_STATE_MOCK } from '@/testing/__fixtures__/gamestate';
import { BOMB_MOCK } from '@/testing/__fixtures__/item';
import { MAP_MOCK } from '@/testing/__fixtures__/map';
import { PLAYER_MOCK } from '@/testing/__fixtures__/player';
import { renderPage, serverSocket, user } from '@/testing/utils';
import { screen, waitFor } from '@testing-library/dom';
import PlayingPage from '../page';

describe('<Bomb Defuse />', () => {
  it('should render the password drawer when clicking on defuse bomb', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit(
      'gamestate',
      JSON.stringify({
        ...GAME_STATE_MOCK,
        items: [{ ...BOMB_MOCK, password: 'secret' }],
      }),
    );
    serverSocket.emit('map', JSON.stringify(MAP_MOCK));
    serverSocket.emit('playerInfo', JSON.stringify(PLAYER_MOCK));

    await waitFor(() => {
      expect(screen.getByTestId('3-0')).toHaveStyle({ background: 'red' });
    });

    await user.click(screen.getByTestId('3-0'));
    await user.click(screen.getByText('Annuler le piège'));

    expect(screen.getByText('Désormaçage de la bombe')).toBeInTheDocument();
    expect(
      screen.getByText('Le mot de passe est : secret'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Veuillez saisir le mot de passe.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Soumettre')).toBeInTheDocument();
  });
});
