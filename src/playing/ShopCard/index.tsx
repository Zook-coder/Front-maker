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
import ShopItemCard from '../ShopItemCard';

const ShopCard = () => {
  const { player, shopItems } = useWebSocket();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Boutique</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {shopItems.map((item) => (
              <ShopItemCard key={item.type} item={item} />
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button>
            <img className="w-4 mr-2" src="/coins.svg" alt="Crédits" />
            {Math.trunc(player?.credits ?? 0)}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ShopCard;
