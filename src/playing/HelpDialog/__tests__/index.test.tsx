import { renderPage, serverSocket, user } from '@/testing/utils';
import HelpDialog from '..';
import { screen, waitFor } from '@testing-library/dom';
import { PLAYER_MOCK } from '@/testing/__fixtures__/player';

describe('<HelpDialog />', () => {
  it('should open automatically on load and close when clicking i understand button', async () => {
    renderPage(<HelpDialog />);

    serverSocket.emit(
      'playerInfo',
      JSON.stringify({ ...PLAYER_MOCK, role: 'Protector' }),
    );

    await waitFor(() => {
      expect(screen.getByText('Comment ça marche ?')).toBeInTheDocument();
      expect(screen.getByText('Vous êtes')).toBeInTheDocument();
      expect(screen.getByText('Protector')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Compris !'));
    expect(screen.queryByText('Comment ça marche ?')).not.toBeInTheDocument();
  });
});
