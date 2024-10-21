import WebSocketProvider from '@/websockets/WebSocketProvider';
import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import userEvent from '@testing-library/user-event';
import { Toaster } from '@/components/ui/toaster';

export const renderPage = (node: ReactNode) => {
  return render(
    <>
      <WebSocketProvider>{node}</WebSocketProvider>
      <Toaster />
    </>,
  );
};

export const user = userEvent.setup();
export { serverSocket, socket } from '@/__mocks__/socket.io-client';
