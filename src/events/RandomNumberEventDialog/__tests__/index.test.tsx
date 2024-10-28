import { RANDOM_NUMBER_EVENT_MOCK } from '@/testing/__fixtures__/event';
import { renderPage, user } from '@/testing/utils';
import { screen } from '@testing-library/dom';
import RandomNumberEventDialog from '..';

describe('<RandomNumberEventDrawer />', () => {
  it('should error if the submitted number is not a number', async () => {
    renderPage(<RandomNumberEventDialog event={RANDOM_NUMBER_EVENT_MOCK} />);

    await user.type(
      screen.getByPlaceholderText('Saisissez un nombre entre 1 et 100'),
      'NaN',
    );
    expect(
      screen.getByText('Veuillez renseigner un nombre'),
    ).toBeInTheDocument();
  });

  it('should error if the submitted number is not a number', async () => {
    renderPage(<RandomNumberEventDialog event={RANDOM_NUMBER_EVENT_MOCK} />);

    await user.type(
      screen.getByPlaceholderText('Saisissez un nombre entre 1 et 100'),
      '-1',
    );
    expect(screen.getByText('Le nombre doit être positif')).toBeInTheDocument();
  });

  it('should error if the submitted number is not a number', async () => {
    renderPage(<RandomNumberEventDialog event={RANDOM_NUMBER_EVENT_MOCK} />);

    await user.type(
      screen.getByPlaceholderText('Saisissez un nombre entre 1 et 100'),
      '100.1',
    );
    expect(
      screen.getByText('Le nombre doit ne peut pas dépasser 100'),
    ).toBeInTheDocument();
  });
});
