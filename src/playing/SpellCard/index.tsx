import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { convertElapsedTime } from '@/lib/utils';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import React from 'react';

interface Props {
  id: number;
  name: string;
  description: string;
}

const SpellCard = ({ name, description }: Props) => {
  const { gameState } = useWebSocket();
  return (
    <Card className="border-transparent shadow-none px-0">
      <CardHeader className="px-0 py-2">
        <div className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          <span className="text-muted-foreground">
            {convertElapsedTime(gameState.timer)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge>Dégats</Badge>
          <Badge variant="outline">Soin</Badge>
        </div>
      </CardHeader>
      <CardDescription>{description}</CardDescription>
      <CardFooter className="px-0 py-4 flex justify-end">
        <Button className="w-full">Envoyer</Button>
      </CardFooter>
    </Card>
  );
};

export default SpellCard;
