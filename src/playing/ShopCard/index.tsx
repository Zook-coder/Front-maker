import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { Coins } from 'lucide-react';
import React from 'react';

const ShopCard = () => {
  const { player } = useWebSocket();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Boutique</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="font-medium">Lame d'infini</p>
            <p className="text-muted-foreground text-xs">300 crédits</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Infos
            </Button>
            <Button size="sm">Acheter</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button>
          <img className="w-4 mr-2" src="/coins.svg" alt="Crédits" />
          {player?.credits ?? 0}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopCard;
