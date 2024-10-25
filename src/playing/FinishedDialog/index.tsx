import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { convertElapsedTime } from '@/lib/utils';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

interface Props {
  open: boolean;
}

const FinishedDialog = ({ open }: Props) => {
  const { gameState, resetGame } = useWebSocket();

  useEffect(() => {
    if (gameState.finishedTimer <= 0) {
      resetGame();
      redirect('/');
    }
  }, [gameState]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fin de partie !</DialogTitle>
          <DialogDescription>
            Le timer a atteint 0 secondes, la partie est finie vous allez être
            redirigé dans {convertElapsedTime(gameState.finishedTimer)}.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FinishedDialog;
