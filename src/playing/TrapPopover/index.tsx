import { Player } from '@/api/player';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { convertElapsedTime } from '@/lib/utils';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import React from 'react';

interface Props {
  id: string;
  name: string;
  owner: Player;
  duration?: number;
  row: number;
  col: number;
}

const TrapPopover = ({ id, name, owner, duration, row, col }: Props) => {
  const { socket, player } = useWebSocket();
  return (
    <div className="px-4 py-2 absolute -top-full left-1/2 -translate-x-1/2 -translate-y-full z-50 min-w-52 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="relative">
        <div className="py-1 flex items-center justify-between">
          <h4 className="text-sm font-semibold leading-none tracking-tight">
            Case piégée
          </h4>
          <span className="text-sm text-muted-foreground">
            {duration ? convertElapsedTime(duration) : 'Infini'}
          </span>
        </div>
        <Separator className="my-2" />
        <div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Posé par</span>
              <span className="text-xs font-medium">{owner.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Piège</span>
              <span className="text-xs font-medium">{name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Coordonnées</span>
              <span className="text-xs font-medium">{`(${row},${col})`}</span>
            </div>
            <Button
              className="h-6 w-full z-[99]"
              size="sm"
              onClick={() => {
                socket?.emit(
                  'item:cancel',
                  JSON.stringify({
                    itemId: id,
                    id: player?.id,
                    row,
                    col,
                  }),
                );
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
        <div className="bg-card w-4 h-4 absolute -bottom-4 left-1/2 -translate-x-1/2 rotate-45"></div>
      </div>
    </div>
  );
};

export default TrapPopover;
