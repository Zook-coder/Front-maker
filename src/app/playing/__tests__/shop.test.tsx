import { renderPage, serverSocket, user } from '@/testing/utils';
import PlayingPage from '../page';
import { SHOP_MOCK } from '@/testing/__fixtures__/shop';
import { screen, waitFor } from '@testing-library/dom';
import { PLAYER_MOCK } from '@/testing/__fixtures__/player';
import { FREEZE_ITEM_MOCK } from '@/testing/__fixtures__/item';

describe('<Shop />', () => {
  it('should render succesfully', async () => {
    renderPage(<PlayingPage />);
    serverSocket.emit('shop', JSON.stringify({ items: SHOP_MOCK }));
    serverSocket.emit(
      'playerInfo',
      JSON.stringify({ ...PLAYER_MOCK, credits: 21 }),
    );

    await waitFor(() => {
      expect(screen.getByText('Boutique')).toBeInTheDocument();
      expect(screen.getByText('Gel')).toBeInTheDocument();
      expect(screen.getByText('100 crédits')).toBeInTheDocument();
      expect(screen.getByText('Infos')).toBeInTheDocument();
      expect(screen.getByText('Acheter')).toBeInTheDocument();
      expect(screen.getByText('21')).toBeInTheDocument();
    });
  });

  it('should open item dialog when clicking on infos button', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit('shop', JSON.stringify({ items: SHOP_MOCK }));
    await waitFor(() => {
      expect(screen.getByText('Infos')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Infos'));
    expect(screen.getByText('Description du sort')).toBeInTheDocument();
    expect(screen.getAllByText('Gel')).toHaveLength(2);
    expect(
      screen.getByText("Gel l'équipe adverse pendant 5 secondes"),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Acheter')).toHaveLength(2);
    expect(screen.getAllByText('100 crédits')).toHaveLength(2);
  });

  it('should add the special item on buy', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));

    serverSocket.emit(
      'playerInfo',
      JSON.stringify({ ...PLAYER_MOCK, credits: 21 }),
    );
    serverSocket.emit('shop', JSON.stringify({ items: SHOP_MOCK }));

    await waitFor(() => {
      expect(screen.getByText('Gel')).toBeInTheDocument();
      expect(screen.getByText('Acheter')).toBeInTheDocument();
      expect(screen.getByText('Acheter')).toBeEnabled();
    });

    await user.click(screen.getByText('Acheter'));
    serverSocket.emit('shop:buy:success', undefined);
    serverSocket.emit(
      'playerInfo',
      JSON.stringify({
        ...PLAYER_MOCK,
        credits: 21,
        specialItems: [FREEZE_ITEM_MOCK],
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('Acheté')).toBeInTheDocument();
      expect(screen.getByText('Acheté')).toBeDisabled();
    });
  });

  it('should render special items on the items sheet', async () => {
    renderPage(<PlayingPage />);
    await user.click(screen.getByText('Compris !'));
    serverSocket.emit(
      'playerInfo',
      JSON.stringify({
        ...PLAYER_MOCK,
        credits: 21,
        specialItems: [FREEZE_ITEM_MOCK],
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('Lancer un sort')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Lancer un sort'));

    expect(screen.getByText('Items spéciaux'));
    expect(screen.getByText('Gel')).toBeInTheDocument();
    expect(screen.getByText('Usage unique')).toBeInTheDocument();
    expect(
      screen.getByText("Gel l'équipe adverse pendant 5 secondes"),
    ).toBeInTheDocument();
    expect(screen.getByText('00:30')).toBeInTheDocument();
  });
});
