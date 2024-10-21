import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { convertElapsedTime } from '@/lib/utils';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import React from 'react';

const StartingDialog = () => {
  const { gameState } = useWebSocket();

  return (
    <Dialog open={gameState.status === 'STARTING'}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Préparez-vous !</DialogTitle>
          <DialogDescription>La partie va commencer.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <p className="text-2xl font-medium leading-none">
            {convertElapsedTime(gameState.startTimer)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartingDialog;
