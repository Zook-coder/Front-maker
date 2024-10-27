import { ItemType } from '@/api/item';
import { ShopItem } from '@/api/shop';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
  item: ShopItem;
}

const ShopItemCard = ({ item }: Props) => {
  const { socket, player } = useWebSocket();
  const [loading, setLoading] = useState(false);
  const [dialogOpened, setDialogOpened] = useState(false);

  const buyItem = async (item: ItemType) => {
    return new Promise((resolve, reject) => {
      socket?.emit('shop:buy', JSON.stringify({ id: player?.id, type: item }));
      socket?.on('shop:buy:success', resolve);
      socket?.on('error', reject);
    });
  };

  const onClick = async (item: ItemType) => {
    setLoading(true);
    try {
      await buyItem(item);
    } catch {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      <div key={item.name} className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="font-medium">{item.name}</p>
          <p className="text-muted-foreground text-xs">{item.cost} crédits</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDialogOpened(!dialogOpened)}
          >
            Infos
          </Button>
          <Button
            disabled={
              player?.specialItems &&
              player.specialItems.some(
                (specialItem) => specialItem.type === item.type,
              )
            }
            size="sm"
            onClick={() => {
              onClick(item.type);
            }}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {player?.specialItems &&
            player.specialItems.some(
              (specialItem) => specialItem.type === item.type,
            )
              ? 'Acheté'
              : 'Acheter'}
          </Button>
        </div>
      </div>
      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Description du sort</DialogTitle>
            <DialogTitle className="text-md">{item.name}</DialogTitle>
            <span className="text-sm text-muted-foreground">
              {item.cost} crédits
            </span>
            <DialogDescription>{item.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={
                player?.specialItems &&
                player.specialItems.some(
                  (specialItem) => specialItem.type === item.type,
                )
              }
              onClick={() => {
                onClick(item.type);
              }}
            >
              Acheter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShopItemCard;
