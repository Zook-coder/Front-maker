import MockComponent from '@/__mocks__/component';
import { renderPage, serverSocket } from '@/testing/utils';
import { screen, waitFor } from '@testing-library/dom';

describe('<WebSocketProvider />', () => {
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
});
