import MockComponent from '@/__mocks__/component';
import { render, waitFor } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import WebSocketProvider from '..';

describe('<WebSocketProvider />', () => {
  let ws: WS;
  beforeEach(() => {
    ws = new WS('ws://localhost:3000');
  });

  afterEach(() => {
    ws.close();
  });

  it('should handle a successfull connection', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    render(
      <WebSocketProvider>
        <MockComponent />
      </WebSocketProvider>,
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Connected!');
    });
  });

  it('should automatically reconnect after 5 seconds when socket is closed', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    render(
      <WebSocketProvider>
        <MockComponent />
      </WebSocketProvider>,
    );

    ws.close();

    await waitFor(() => {
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
    });

    ws = new WS('ws://localhost:3000');
    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Connected!');
    });
  });
});
