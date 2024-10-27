import { Item } from '@/api/item';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { convertElapsedTime } from '@/lib/utils';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
  item: Item;
}

const SpecialItemCard = ({ item }: Props) => {
  const { socket, player } = useWebSocket();
  const [loading, setLoading] = useState(false);

  const activateItem = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      socket?.emit(
        'item:activate',
        JSON.stringify({
          id: player?.id,
          item: item.type,
        }),
      );
      socket?.on('item:activate:success', () => {
        toast({
          title: 'Bien reçu !',
          description: "L'item a été activé avec succès.",
        });
        resolve();
      });
      socket?.on('error', reject);
    });
  };

  const onClick = async () => {
    setLoading(true);
    try {
      await activateItem();
    } catch {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <Card className="border-transparent shadow-none px-0">
      <CardHeader className="px-0 py-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{item.name}</CardTitle>
          <span className="text-muted-foreground text-sm">
            Durée: {item.durationLength}s
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge>Usage unique</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <CardDescription>{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="px-0 flex justify-end">
        <Button
          disabled={loading || item.currentCooldown != 0}
          className="w-full"
          onClick={onClick}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {item.currentCooldown === 0
            ? 'Prêt'
            : convertElapsedTime(item.currentCooldown)}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpecialItemCard;
